import { SyncableConfig } from '../../../src/syncable.js';

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
  spec: SyncableConfig,
  query: Record<string, string | undefined>,
  // headers: Record<string, string | undefined>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  let numItems = 1;
  let hasMore = false;
  switch (spec.pagingStrategy) {
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
          body = setObjectPath(body, spec.nextPageTokenPathInResponse || ['nextPageToken'], nextPageToken);
        } else {
          // console.log('no more pages');
          setObjectPath(body, spec.nextPageTokenPathInResponse || ['nextPageToken'], null);
        }
      }
      break;
    default: {
      numItems = 10;
    }
  }
  console.log('body before pagination', body, spec.itemsPathInResponse, numItems);
  const page = [];
  const item = getObjectPath(body, spec.itemsPathInResponse)[0];
  for (let i = 0; i < numItems; i++) {
    page.push(item);
  }
  return setObjectPath(body, spec.itemsPathInResponse, page);
}
