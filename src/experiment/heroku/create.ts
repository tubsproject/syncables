import { baseUrl, getAuthHeaderSet } from './common.js';

async function createItem(authHeaders: {
  [key: string]: string;
}, hostname: string): Promise<void> {
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
      hostname,
      sni_endpoint: null,
    }),
  });
  const created = await result.text();
  console.log(created);
  console.log(result.ok, result.status);
}

// ...
if (process.argv.length < 3) {
  console.log('please specify domain name');
}
createItem(await getAuthHeaderSet(), process.argv[2]);
