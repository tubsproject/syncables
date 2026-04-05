import { baseUrl, getAuthHeaderSet } from './common.js';

async function deleteItem(
  authHeaders: { [key: string]: string },
  itemId: string,
): Promise<void> {
  if (itemId === 'a2516ec8-8e5e-48ae-b0cc-2051aab43893') {
    throw new Error('do not delete this one, it is in actual use');
  }
  const url = `${baseUrl}/${itemId}`;
  const result = await fetch(url, {
    method: 'delete',
    headers: Object.assign({
      'Content-Type': 'application/json',
      Accept: 'application/vnd.heroku+json; version=3',
    }, authHeaders),
  });
  const deleted = await result.text();
  console.log(deleted);
  console.log(result.ok, result.status);
}

// ...
if (process.argv.length < 3) {
  throw new Error('please specify teamId to delete');
}
const itemId = process.argv[2];
console.log('deleting', itemId);
deleteItem(await getAuthHeaderSet(), itemId);
