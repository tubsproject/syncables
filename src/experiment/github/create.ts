import { getAuthHeaderSet, baseUrl } from './common.js';

export async function createComment(authHeaders: {
  [key: string]: string;
}): Promise<void> {
  const result = await fetch(baseUrl, {
    method: 'post',
    headers: Object.assign(
      {
        // 'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2026-03-10',
        Accept: 'application/vnd.github+json',
      },
      authHeaders,
    ),
    body: JSON.stringify({
      body: 'testing',
    }),
  });
  const obj = await result.json();
  console.log(obj.id);
  console.log(result.ok, result.status);
}

// ...
createComment(await getAuthHeaderSet());
