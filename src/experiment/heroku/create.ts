import { baseUrl, getAuthHeaderSet } from './common.js';

async function createEvent(authHeaders: {
  [key: string]: string;
}): Promise<void> {
  const result = await fetch(baseUrl, {
    method: 'post',
    headers: Object.assign(
      {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.heroku+json; version=3',
      },
      authHeaders,
    ),
    body: JSON.stringify({
      name: `testing-${new Date().getTime()}`,
    }),
  });
  const created = await result.json();
  console.log(created.id);
  console.log(result.ok, result.status);
}

// ...
createEvent(await getAuthHeaderSet());
