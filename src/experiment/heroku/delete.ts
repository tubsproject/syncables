import { baseUrl, getAuthHeaderSet } from './common.js';

async function deleteTeam(
  authHeaders: { [key: string]: string },
  teamId: string,
): Promise<void> {
  if (teamId === 'a2516ec8-8e5e-48ae-b0cc-2051aab43893') {
    throw new Error('do not delete this one, it is in actual use');
  }
  const url = `${baseUrl}/${teamId}`;
  const result = await fetch(url, {
    method: 'delete',
    headers: Object.assign({
    }, authHeaders),
  });
  const deleted = await result.text();
  console.log(deleted);
  console.log(result.ok, result.status);
}

// ...
if (process.argv.length < 3) {
  throw new Error('please specify teamId to delete');
}
const teamId = process.argv[2];
console.log('deleting', teamId);
deleteTeam(await getAuthHeaderSet(), teamId);
