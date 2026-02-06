import { SyncableConfig } from '../../../src/syncable.js';

export function applyPagination(
  body: any,
  spec: SyncableConfig,
  query: Record<string, string | undefined>,
  // headers: Record<string, string | undefined>,
): any {
  let numItems = 1;
  let hasMore = false;
  switch (spec.pagingStrategy) {
    case 'pageNumber':
      let pageNum = parseInt(query[spec.pageNumberParamInQuery ?? 'page'], 10);
      if (isNaN(pageNum) || pageNum < 1) {
        pageNum = 1;
      }
      numItems = pageNum < 4 ? 10: pageNum == 4 ? 7 : 0;
      hasMore = pageNum < 4;
    break;
    case 'pageToken':
      const pageToken = query[spec.pageTokenParamInQuery ?? 'pageToken'];
      console.log('serving pageToken', pageToken);
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
        numItems = 0;
      }
      if (hasMore) {
        const nextPageToken = `token-${page + 1}`;
        body[spec.pageTokenParamInResponse ?? 'nextPageToken'] = nextPageToken;
        console.log('next page token', nextPageToken);
      } else {
        body[spec.pageTokenParamInResponse ?? 'nextPageToken'] = null;
        console.log('no next page token');
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
    while (pointer.length > numItems) {
      pointer.pop();
    }
  }
  return body;
}
