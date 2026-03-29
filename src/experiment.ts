import { readFile } from 'fs/promises';

const tokenPath = './.credentials/google-calendar.json';
const calendarId = 'c_52ec575bebbb01690d5ed98c1b7c23ecf3367ed1373bb98df3c319bb766bba41@group.calendar.google.com';

export async function createCalendar(): Promise<void> {
  const authHeadersStr = await readFile(tokenPath, 'utf-8');
  const authHeaders = JSON.parse(authHeadersStr);
  const result = await fetch(' https://www.googleapis.com/calendar/v3/calendars', {
    method: 'post',
    headers: Object.assign({
      'Content-Type': 'application/json',
    }, authHeaders),
    body: JSON.stringify({
      description: 'testing',
      summary: 'testing',
    }),
  });
  console.log(await result.text());
  console.log(result.ok, result.status);
}
export async function createEvent(): Promise<void> {
  const authHeadersStr = await readFile(tokenPath, 'utf-8');
  const authHeaders = JSON.parse(authHeadersStr);
  const result = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
    method: 'post',
    headers: Object.assign({
      'Content-Type': 'application/json',
    }, authHeaders),
    body: JSON.stringify({
      description: 'testing',
      summary: 'testing',
      start: {
        date: '2026-04-02',
      },
      end: {
        date: '2026-04-02',
      },
    }),
  });
  console.log(await result.text());
  console.log(result.ok, result.status);
}

// ...
// createCalendar();
createEvent();