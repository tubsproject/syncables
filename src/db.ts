/* eslint @typescript-eslint/no-explicit-any: 0 */
import { Client } from 'pg';
export { Client } from 'pg';

export async function getPostgresClient(): Promise<Client> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not set');
  }
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });
  try {
    await client.connect();
  } catch (err) {
    await client.end();
    throw new Error(`Failed to connect to database: ${err}`);
  }
  return client;
}

export function getFields(
  openApiSpec: any,
  endPoint: string,
  rowsFrom: string[],
): { [key: string]: { type: string } } | undefined {
  const successResponseProperties =
    openApiSpec.paths[endPoint]?.get?.responses?.['200']?.content;
  // console.log(openApiSpec.paths, endPoint);
  const syncableType: string =
    openApiSpec.paths[endPoint]?.get?.responses?.['200']?.syncable?.type ||
    'collection';
  let schema =
    successResponseProperties?.['application/ld+json']?.schema ||
    successResponseProperties?.['application/json']?.schema;
  // console.log('looking for fields in schema:', JSON.stringify(schema, null, 2));
  for (let i = 0; i < rowsFrom.length; i++) {
    const part = rowsFrom[i];
    if (schema?.properties?.[part]) {
      schema = schema.properties[part];
    } else if (schema?.allOf) {
      let foundPart = false;
      for (let i = 0; i < schema.allOf.length; i++) {
        if (schema.allOf[i].properties?.[part]) {
          schema = schema.allOf[i].properties[part];
          foundPart = true;
          break;
        }
      }
      if (!foundPart) {
        throw new Error(
          `Could not find part ${part} in any of the allOf entries for endpoint ${endPoint}`,
        );
      }
    } else {
      throw new Error(
        `Could not find part ${part} in schema for endpoint ${endPoint}`,
      );
    }
  }
  const sub = syncableType === 'collection' ? schema?.items : schema;
  let whatWeWant = sub?.properties;
  if (!whatWeWant && sub?.allOf) {
    whatWeWant = {};
    sub.allOf.forEach((entry: any) => {
      if (entry.properties) {
        Object.assign(whatWeWant, entry.properties);
      }
    });
  }
  // console.log(
  //   `What we want (getFields ${endPoint} ${rowsFrom}):`,
  //   JSON.stringify(whatWeWant, null, 2),
  // );
  return whatWeWant;
}
export async function createSqlTable(
  client: Client,
  tableName: string,
  whatWeWant: { [key: string]: { type: string } },
  idField: string,
  params: { [key: string]: 'string' | 'number' } = {},
): Promise<void> {
  const rowSpecs: { [columnName: string]: string } = {};
  // console.log(
  //   `What we want (createSqlTable ${tableName}):`,
  //   JSON.stringify(whatWeWant, null, 2),
  // );
  if (!whatWeWant) {
    throw new Error(`No fields found for table ${tableName}`);
  }
  Object.entries(whatWeWant).forEach(([key, value]) => {
    const type = (value as { type: string }).type;
    if (type === 'string') {
      rowSpecs[`S${key}`] = `TEXT${key === idField ? ' PRIMARY KEY' : ''}`;
    } else if (type === 'boolean') {
      rowSpecs[`S${key}`] = `BOOLEAN`;
    } else if (type === 'number') {
      rowSpecs[`S${key}`] = `INTEGER${key === idField ? ' PRIMARY KEY' : ''}`;
      // } else {
      //   throw new Error(
      //     `Unsupported type ${JSON.stringify(type)} for field ${key} in table ${tableName}`,
      //   );
    }
  });
  Object.entries(params).forEach(([key, type]) => {
    if (type === 'string') {
      rowSpecs[`S${key}`] = `TEXT`;
    } else if (type === 'number') {
      rowSpecs[`S${key}`] = `INTEGER`;
      // } else {
      //   throw new Error(
      //     `Unsupported type ${JSON.stringify(type)} for param ${key} in table ${tableName}`,
      //   );
    }
  });
  const createTableQuery = `
CREATE TABLE IF NOT EXISTS ${tableName.replace('-', '_')} (
  ${Object.entries(rowSpecs)
    .map(([key, value]) => `"${key}" ${value}`)
    .join(',\n  ')}\n
);
`;
  // console.log(createTableQuery);
  await client.query(createTableQuery);
}
export async function insertData(
  client: Client,
  tableName: string,
  items: any[],
  fields: string[],
  idField: string,
): Promise<void> {
  // console.log(`Inserting data into table ${tableName}:`, items);
  await Promise.all(
    items.map((item: any) => {
      // FIXME: use parameterized queries instead of string interpolation to avoid SQL injection issues, and properly handle escaping of values
      const insertQuery = `INSERT INTO ${tableName.replace('-', '_')} (${fields.map((x) => `"S${x}"`).join(', ')}) VALUES (${fields.map((field) => `'${item[field]?.toString().replace(/'/g, "''")}'`).join(', ')}) ON CONFLICT ("S${idField}") DO NOTHING`;
      // console.log(`Executing insert query: ${insertQuery}`);
      return client.query(insertQuery);
    }),
  );
}
