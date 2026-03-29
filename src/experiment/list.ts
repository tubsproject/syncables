import { readFile } from 'fs/promises';

const tokenPath = './.credentials/google-calendar.json';
const baseUrl = `/repos/tubsproject/syncables/issues/69/comments`;
const pageSize = 5;

export async function listEvents(pageNumber?: string): Promise<void> {
  const authHeadersStr = await readFile(tokenPath, 'utf-8');
  const authHeaders = JSON.parse(authHeadersStr);
  const url = new URL(baseUrl);
  url.searchParams.append(`per_page`, pageSize.toString());
  if (pageNumber) {
    url.searchParams.append(`page`, pageNumber);
  }
  console.log(url);
  const result = await fetch(url, {
    headers: Object.assign({
    }, authHeaders),
  });
  const { updated, nextSyncToken, nextPageToken, items } = await result.json();
  console.log({ updated, nextSyncToken, nextPageToken, length: items.length });
  console.log(items.map(i => i.id));
  console.log(result.ok, result.status);
}

// ...
const pageNumber = process.argv[2];
console.log('fetching with', pageNumber);
listEvents(pageNumber);