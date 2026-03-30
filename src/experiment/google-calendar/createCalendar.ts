import { baseUrlForCreateCalendar, getAuthHeaderSet } from './common.js';

async function createCalendar(authHeaders: { [key: string]: string }): Promise<void> {
  const result = await fetch(
    baseUrlForCreateCalendar,
    {
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
      }),
    },
  );
  const created = await result.json();
  console.log(created.id);
  console.log(result.ok, result.status);
}

// ...
createCalendar(await getAuthHeaderSet());
