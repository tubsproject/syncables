import { getSecuritySchemeObjects } from '../../utils.js';
import { getAuthHeaderSets } from '../../auth.js';

export const baseUrl = `https://api.github.com/repos/michielbdejong/bookkeeping.network/issues/3/comments`;
export const baseUrlForDelete = `https://api.github.com/repos/michielbdejong/bookkeeping.network/issues/comments/`;
const securitySchemeNames = {
  github: 'oauth2',
};
const apiNames = Object.keys(securitySchemeNames);

export async function getAuthHeaderSet(): Promise<{ [key: string]: string }> {
  const { securitySchemeObjects } = await getSecuritySchemeObjects(
    apiNames,
    securitySchemeNames,
  );
  const authHeaders = await getAuthHeaderSets(apiNames, securitySchemeObjects);
  return authHeaders.github;
}
