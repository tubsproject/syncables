import { readFile } from 'fs/promises';

const appId = 'bcd7d4c3-491f-4576-a01b-e7a1b8e45498';
export const baseUrl = `https://api.heroku.com/apps/${appId}/domains`;
const pageSize = 5;

export async function getAuthHeaderSet(): Promise<{ [key: string]: string }> {
  const buff = await readFile('./.credentials/heroku.json');
  return JSON.parse(buff.toString());
}

export async function listItems(
  authHeaders: { [key: string]: string },
  field: string,
  firstId?: string,
): Promise<{ [id: string]: string}> {
  const url = new URL(baseUrl);
  let Range = `${field} ..; max=${pageSize}`;
  if (firstId !== undefined)  {
    Range = `${field} ]${firstId}..; max=${pageSize}`;
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
  const ret = {};
  items.forEach(item => {
    ret[item.id] = item.hostname;
  });
  return ret;
}
