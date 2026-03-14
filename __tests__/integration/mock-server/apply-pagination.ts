import { PaginationScheme, generateSyncableSpec } from '../../../src/spec.js';
import { getObjectPath, setObjectPath } from '../../../src/utils.js';
import type { OpenAPIV3_1 } from '@scalar/openapi-types';

export const confirmedItemIds: { [id: string]: boolean } = {};
for (let i = 0; i < 50; i += 1) {
  confirmedItemIds[i.toString()] = false;
}

export function applyPagination(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  path: string,
  query: Record<string, string | undefined>,
  // headers: Record<string, string | undefined>,
  doc: OpenAPIV3_1.Document,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const paginationScheme = doc?.components?.['paginationSchemes']
    ?.default as PaginationScheme;
  console.log('applying pagination', paginationScheme);
  let numItems = 1;
  let hasMore = false;
  const spec = generateSyncableSpec(path, doc);
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
