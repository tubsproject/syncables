import { baseUrl, getAuthHeaderSet } from './common.js';

async function deleteEvent(authHeaders: { [key: string]: string }, eventId: string): Promise<void> {
  const url = `${baseUrl}/${eventId}`
  const result = await fetch(
    url,
    {
      method: 'delete',
      headers: Object.assign(
        {
        },
        authHeaders,
      ),
    },
  );
  const deleted = await result.text();
  console.log(deleted);
  console.log(result.ok, result.status);
}

// ...
const eventId = process.argv[2];
// console.log('deleting', eventId);
deleteEvent(await getAuthHeaderSet(), eventId);
