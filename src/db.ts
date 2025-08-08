/* eslint @typescript-eslint/no-explicit-any: 0 */
import { Client } from 'pg';
const client = await getPostgresClient();

async function getPostgresClient(): Promise<Client> {
  const client = new Client({
    user: process.env.POSTGRES_APP_USER || 'syncables',
    password: process.env.POSTGRES_APP_PASSWORD || 'syncables',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_APP_DB || 'syncables',
  }); 
  await client.connect();
  return client;
}

export async function createSqlTable(
  openApiSpec: any,
  endPoint: string,
  rowsFrom: string,
): Promise<void> {
  const schema =
    openApiSpec.paths[endPoint]?.get?.responses?.['200']?.content?.[
      'application/json'
    ]?.schema;
  // console.log(`Schema for ${endPoint}:`, JSON.stringify(schema, null, 2));
  const whatWeWant = schema?.properties?.[rowsFrom].items?.properties;
  // console.log(`What we want:`, JSON.stringify(whatWeWant, null, 2));
  const rowSpecs = [];
  Object.entries(whatWeWant).forEach(([key, value]) => {
    if (key === 'primary') {
      key = 'primary_';
    }
    const type = (value as { type: string }).type;
    if (type === 'string') {
      rowSpecs.push(`${key} TEXT`);
    } else if (type === 'integer') {
      rowSpecs.push(`${key} INTEGER`);
    } else if (type === 'boolean') {
      rowSpecs.push(`${key} BOOLEAN`);
    }
  });
  const createTableQuery = `
CREATE TABLE IF NOT EXISTS data(
  ${rowSpecs.join(',\n  ')}\n
);
`;
  console.log(createTableQuery);
  await client.query(createTableQuery);
}
export async function insertData(
  data: any,
): Promise<void> {
  console.log(`Fetched data:`, data);
  await Promise.all(data.items.map((item: any) => {
    // const insertQuery = `INSERT INTO data (${Object.keys(item).join(', ')}) VALUES (${Object.values(item).map(v => `'${v}'`).join(', ')}`;
    const insertQuery = `INSERT INTO data (id, summary, description) VALUES ('${item.id}', '${item.summary}', '${item.description}')`;
    console.log(`Executing insert query: ${insertQuery}`);
    return client.query(insertQuery);
  }));
}
export async function closeClient(): Promise<void> {
  await client.end();
}