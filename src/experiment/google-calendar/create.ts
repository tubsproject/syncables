import { baseUrl, getAuthHeaderSet } from './common.js';

async function createEvent(authHeaders: {
  [key: string]: string;
}): Promise<void> {
  const result = await fetch(baseUrl, {
    method: 'post',
    headers: Object.assign(
      {
        'Content-Type': 'application/json',
      },
      authHeaders,
    ),
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
  const created = await result.json();
  console.log(created.id);
  console.log(result.ok, result.status);
}

// ...
createEvent(await getAuthHeaderSet());
