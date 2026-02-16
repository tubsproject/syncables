import { SyncerConfig } from '../../../src/syncer.js';

export const confirmedItemIds: { [id: string]: boolean } = {};
for (let i = 0; i < 50; i += 1) {
  confirmedItemIds[i.toString()] = false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getObjectPath(obj: object, path?: string[]): any {
  if (path === undefined) {
    return obj;
  }
  if (!Array.isArray(path) || path.length === 0) {
    throw new Error(`Path must be a non-empty array of strings`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pointer: any = obj;
  for (let i = 0; i < path.length; i++) {
    const part = path[i];
    if (pointer && typeof pointer === 'object' && part in pointer) {
      pointer = pointer[part];
    } else {
      throw new Error(`Path not found: ${path.slice(0, i + 1).join('.')}`);
    }
  }
  return pointer;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setObjectPath(obj: object, path: string[], value: any): object {
  if (path === undefined) {
    // console.log('no path provided, returning value as object');
    return value;
  }
  if (!Array.isArray(path) || path.length === 0) {
    throw new Error(`Path must be a non-empty array of strings`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pointer: any = obj;
  for (let i = 0; i < path.length; i++) {
    const part = path[i];
    if (i === path.length - 1) {
      // Last part, set the value
      if (pointer && typeof pointer === 'object') {
        pointer[part] = value;
      }
    } else {
      // Traverse down the object
      if (pointer && typeof pointer === 'object' && part in pointer) {
        pointer = pointer[part];
      } else {
        pointer = null;
      }
    }
  }
  return obj;
}

export function applyPagination(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  spec: SyncerConfig,
  query: Record<string, string | undefined>,
  // headers: Record<string, string | undefined>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  let numItems = 1;
  let hasMore = false;
  switch (spec.paginationStrategy) {
    case 'pageNumber':
      {
        let pageNum = parseInt(
          query[spec.pageNumberParamInQuery ?? 'page'],
          10,
        );
        if (isNaN(pageNum) || pageNum < 1) {
          pageNum = 1;
        }
        // console.log('serving pageNumber', pageNum);
        if (pageNum > 5) {
          throw new Error('No more pages');
        }
        numItems = pageNum < 4 ? 10 : pageNum == 4 ? 7 : 0;
        hasMore = pageNum < 4;
      }
      break;
    case 'offset':
      {
        let offset = parseInt(query[spec.offsetParamInQuery ?? 'offset'], 10);
        if (isNaN(offset) || offset < 0) {
          offset = 0;
        }
        // console.log('serving offset', offset);
        if (offset > 50) {
          throw new Error('No more pages');
        }
        numItems = Math.min(10, 37 - offset);
        hasMore = numItems > 0;
      }
      break;
    case 'pageToken':
      {
        const pageToken = query[spec.pageTokenParamInQuery ?? 'pageToken'];
        // console.log('serving pageToken', pageToken);
        let page = 1;
        if (!pageToken) {
          numItems = 10;
          hasMore = true;
        } else if (pageToken === 'token-2') {
          page = 2;
          numItems = 10;
          hasMore = true;
        } else if (pageToken === 'token-3') {
          page = 3;
          numItems = 5;
        } else {
          // console.log('no more pages for token', pageToken);
          numItems = 0;
        }
        if (hasMore) {
          const nextPageToken = `token-${page + 1}`;
          // console.log('setting nextPageToken', nextPageToken);
          body = setObjectPath(
            body,
            spec.nextPageTokenPathInResponse || ['nextPageToken'],
            nextPageToken,
          );
        } else {
          // console.log('no more pages');
          setObjectPath(
            body,
            spec.nextPageTokenPathInResponse || ['nextPageToken'],
            null,
          );
        }
      }
      break;
    case 'dateRange':
      {
        let startDate = parseInt(
          query[spec.startDateParamInQuery ?? 'startDate'],
          10,
        );
        if (isNaN(startDate)) {
          startDate = 20000101000000;
        }
        let endDate = parseInt(
          query[spec.endDateParamInQuery ?? 'endDate'],
          10,
        );
        if (isNaN(endDate)) {
          endDate = 99990101000000;
        }
        let dates = [
          20220101000000, 20220201000000, 20220301000000, 20220401000000,
          20220501000000, 20220601000000, 20220701000000, 20220801000000,
          20220901000000,
        ];
        dates = dates.filter((d) => d >= startDate && d <= endDate);
        numItems = dates.length;
        console.log('dateRange numItems', numItems, startDate, endDate);
      }
      break;
    case 'confirmationBased':
      {
        numItems = Math.min(
          10,
          Object.keys(confirmedItemIds).filter((id) => !confirmedItemIds[id])
            .length,
        );
      }
      break;
    default: {
      numItems = 10;
    }
  }
  // console.log(
  //   'body before pagination',
  //   body,
  //   spec.itemsPathInResponse,
  //   numItems,
  // );
  const page = [];
  const item = getObjectPath(body, spec.itemsPathInResponse)[0];
  for (let i = 0; i < numItems; i++) {
    page.push(Object.assign({}, item));
  }
  // console.log('page generated with numItems', numItems);
  if (spec.paginationStrategy === 'confirmationBased') {
    // console.log('set ids to unconfirmed ones');
    let i = 0;
    Object.keys(confirmedItemIds)
      .filter((id) => !confirmedItemIds[id])
      .forEach((id) => {
        if (i >= numItems) {
          return;
        }
        // console.log('found unconfirmed id', id);
        page[i][spec?.idField || 'id'] = id;
        // console.log(`setting id ${id} at index ${i}`);
        i++;
      });
  }
  return setObjectPath(body, spec.itemsPathInResponse, page);
}
