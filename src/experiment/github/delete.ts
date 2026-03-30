import { getAuthHeaderSet, baseUrlForDelete } from './common.js';

export async function deleteComment(authHeaders: {
  [key: string]: string;
}, commentId: string): Promise<void> {
  const commentUrl = `${baseUrlForDelete}${commentId}`;
  console.log(commentUrl);
  const result = await fetch(commentUrl, {
    method: 'delete',
    headers: Object.assign(
      {
        // 'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2026-03-10',
        Accept: 'application/vnd.github+json',
      },
      authHeaders,
    ),
  });
  const obj = await result.text();
  console.log(obj);
  console.log(result.ok, result.status);
}

// ...
// FIXME: unescaped user input, don't try this at home:
const commentId = process.argv[2];
console.log('deleting', commentId);
deleteComment(await getAuthHeaderSet(), commentId);
