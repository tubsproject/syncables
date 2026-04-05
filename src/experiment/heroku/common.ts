import { readFile } from 'fs/promises';

export const baseUrl = `https://api.heroku.com/teams`;
const pageSize = 5;

export async function getAuthHeaderSet(): Promise<{ [key: string]: string }> {
  const buff = await readFile('./.credentials/heroku.json');
  return JSON.parse(buff.toString());
}

export async function listTeams(
  authHeaders: { [key: string]: string },
  firstId?: string,
): Promise<object[]> {
  const url = new URL(baseUrl);
  let Range = `id ..; max=${pageSize}`;
  if (firstId !== undefined)  {
    Range = `id ]${firstId}..; max=${pageSize}`;
  }
  console.log({ Range }); 
  const result = await fetch(url, {
    headers: Object.assign({
      Accept: 'application/vnd.heroku+json; version=3',
      Range,
    }, authHeaders),
  });
  const items = await result.json();
  console.log(result.ok, result.status);
  return items.map(item => {
    return {
      id: item.id,
      name: item.name
    };
  });
}
