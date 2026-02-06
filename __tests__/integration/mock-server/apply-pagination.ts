import { SyncableConfig } from '../../../src/syncable.js';

export function applyPagination(
  body: any,
  spec: SyncableConfig,
  query: Record<string, string | undefined>,
  // headers: Record<string, string | undefined>,
): any {
  let numItems = 1;
  switch (spec.pagingStrategy) {
    case 'pageNumber':
      let pageNum = parseInt(query[spec.pageNumberParamInQuery ?? 'page'], 10);
      if (isNaN(pageNum) || pageNum < 1) {
        pageNum = 1;
      }
      numItems = pageNum < 4 ? 10: pageNum == 4 ? 7 : 0;
    break;
    case 'pageToken':
      const pageToken = query[spec.pageTokenParamInQuery ?? 'pageToken'];
      if (!pageToken) {
        numItems = 10;
      } else if (pageToken === 'token-2') {
        numItems = 10;
      } else if (pageToken === 'token-3') {
        numItems = 5;
      } else {
        numItems = 0;
      }
    break;
    default:
      numItems = 10;
  }
  let pointer = body;
  spec.itemsPathInResponse.forEach((part) => {
    if (pointer && typeof pointer === 'object' && part in pointer) {
      pointer = pointer[part];
    } else {
      pointer = null;
    }
  });
  if (Array.isArray(pointer)) {
    while (pointer.length < numItems) {
      pointer.push(pointer[0]);
    }
  }
  return body;
}
