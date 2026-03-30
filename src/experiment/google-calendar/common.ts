import { getSecuritySchemeObjects } from '../../utils.js';
import { getAuthHeaderSets } from '../../auth.js';

const calendarId = `c_cef6fcbc055f9caf91360c48d4bbc09aff42317d1348fd7418ce54935df219be@group.calendar.google.com`;
export const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
export const baseUrlForCreateCalendar = `https://www.googleapis.com/calendar/v3/calendars`;
const securitySchemeNames = {
    'google-calendar': 'Oauth2c',
};
const apiNames = Object.keys(securitySchemeNames);
const pageSize = 5;

export async function getAuthHeaderSet(): Promise<{ [key: string]: string }> {
  const { securitySchemeObjects } = await getSecuritySchemeObjects(
    apiNames,
    securitySchemeNames,
  );
  const authHeaders = await getAuthHeaderSets(apiNames, securitySchemeObjects);
  return authHeaders['google-calendar'];
}

export async function listEvents(authHeaders: { [key: string]: string }, queryParams: { [key: string]: string }): Promise<object[]> {
  const url = new URL(baseUrl);
  url.searchParams.append(`maxResults`, pageSize.toString());
  Object.keys(queryParams).forEach(key => {
    url.searchParams.append(key, queryParams[key]);
  });
  console.log(url.href);
  const result = await fetch(url, {
    headers: Object.assign({}, authHeaders),
  });
  const { updated, nextSyncToken, nextPageToken, items } = await result.json();
  console.log({ updated, nextSyncToken, nextPageToken, length: items.length });
  console.log(items.map((i) => [i.id, i.status]));
  console.log(result.ok, result.status);
  return items;
}
