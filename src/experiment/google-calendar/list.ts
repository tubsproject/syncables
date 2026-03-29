import { readFile } from 'fs/promises';

const tokenPath = './.credentials/google-calendar.json';
const calendarId =
  'c_52ec575bebbb01690d5ed98c1b7c23ecf3367ed1373bb98df3c319bb766bba41@group.calendar.google.com';
const pageSize = 5;

export async function listEvents(pageToken?: string): Promise<void> {
  const authHeadersStr = await readFile(tokenPath, 'utf-8');
  const authHeaders = JSON.parse(authHeadersStr);
  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
  );
  url.searchParams.append(`maxResults`, pageSize.toString());
  if (pageToken) {
    url.searchParams.append(`pageToken`, pageToken);
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
const pageToken = process.argv[2];
console.log('fetching with', pageToken);
listEvents(pageToken);
