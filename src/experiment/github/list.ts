import { baseUrl, getAuthHeaderSet } from './common.js';

const pageSize = 5;

export async function listEvents(
  authHeaders: { [key: string]: string },
  pageNumber?: string,
): Promise<void> {
  const url = new URL(baseUrl);
  url.searchParams.append(`per_page`, pageSize.toString());
  if (pageNumber) {
    url.searchParams.append(`page`, pageNumber);
  }
  console.log(url.href);
  const result = await fetch(url, {
    headers: Object.assign({}, authHeaders),
  });
  const items = await result.json();
  console.log(items.map((obj) => obj.id));
  console.log(result.ok, result.status);
}

// ...
const pageNumber = process.argv[2];
// console.log('fetching with', pageNumber);
listEvents(await getAuthHeaderSet(), pageNumber);
