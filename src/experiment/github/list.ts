import { getSecuritySchemeObjects } from '../../utils.js';
import { getAuthHeaderSets } from '../../auth.js';

const baseUrl = `https://api.github.com/repos/tubsproject/syncables/issues/69/comments`;
const pageSize = 5;
const securitySchemeNames = {
  github: 'oauth2',
};
const apiNames = Object.keys(securitySchemeNames);

export async function listEvents(
  authHeaders: { [key: string]: string },
  pageNumber?: string,
): Promise<void> {
  const url = new URL(baseUrl);
  url.searchParams.append(`per_page`, pageSize.toString());
  if (pageNumber) {
    url.searchParams.append(`page`, pageNumber);
  }
  console.log(url);
  const result = await fetch(url, {
    headers: Object.assign({}, authHeaders),
  });
  const { updated, nextSyncToken, nextPageToken, items } = await result.json();
  console.log({ updated, nextSyncToken, nextPageToken, length: items.length });
  console.log(items.map((i) => i.id));
  console.log(result.ok, result.status);
}

// ...
const pageNumber = process.argv[2];
console.log('fetching with', pageNumber);
const { securitySchemeObjects } = await getSecuritySchemeObjects(
  apiNames,
  securitySchemeNames,
);
console.log(
  'Selected security scheme objects for all APIs',
  securitySchemeObjects,
);

const authHeaders = await getAuthHeaderSets(apiNames, securitySchemeObjects);
listEvents(authHeaders.github, pageNumber);
