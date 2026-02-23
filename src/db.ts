/* eslint @typescript-eslint/no-explicit-any: 0 */
import type { OpenAPIV3 } from '@scalar/openapi-types';
import { Client } from 'pg';
import { withArray } from 'pg-format';
import { SyncableSpec } from './syncer.js';
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
  schema: OpenAPIV3.SchemaObject,
  spec: SyncableSpec,
): { [key: string]: { type: string } } | undefined {
  const syncableType: string = spec?.type || 'collection';
  const rowsFrom = spec?.itemsPathInResponse || [];
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
          `Could not find part ${part} in any of the allOf entries`,
        );
      }
    } else {
      throw new Error(`Could not find part ${part} in schema`);
    }
  }
  const sub = syncableType === 'collection' ? schema?.items : schema;
  // console.log(syncableType, sub);
  let whatWeWant = sub?.properties;
  if (!whatWeWant && sub?.allOf) {
    whatWeWant = {};
    sub.allOf.forEach((entry: OpenAPIV3.SchemaObject) => {
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
function getDataType(value: any, idField: string): string {
  const type = (value as { type: string }).type;
  if (type === 'string') {
    return `TEXT${idField ? ' PRIMARY KEY' : ''}`;
  } else if (type === 'boolean') {
    return `BOOLEAN`;
  } else if (type === 'number') {
    return `INTEGER${idField ? ' PRIMARY KEY' : ''}`;
  } else {
    // we will JSON stringify
    return `TEXT${idField ? ' PRIMARY KEY' : ''}`;
  }
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
    rowSpecs[`S${key}`] = getDataType(
      value,
      key === idField ? ' PRIMARY KEY' : '',
    );
  });
  Object.entries(params).forEach(([key, type]) => {
    rowSpecs[`S${key}`] = getDataType(
      { type },
      key === idField ? ' PRIMARY KEY' : '',
    );
  });
  const placeHolders: string[] = [];
  const names: string[] = [tableName];
  Object.entries(rowSpecs).forEach(([key, value]) => {
    placeHolders.push(`%I %s`);
    names.push(key);
    names.push(value);
  });
  const createTableQuery = withArray(
    `CREATE TABLE IF NOT EXISTS %s (${placeHolders.join(', ')})`,
    names,
  );

  console.log(createTableQuery);
  // throw new Error('stop');
  await client.query(createTableQuery);
}
export async function insertData(
  client: Client,
  tableName: string,
  items: any[],
  fields: string[],
  idField: string,
): Promise<void> {
  if (items.length === 0) {
    // console.log(`No items to insert into table ${tableName}`);
    return;
  }
  // console.log(`Inserting data into table ${tableName}:`, items);
  const placeHolders: string[] = [];
  const args: (string | object)[] = [tableName];
  fields.forEach((field) => {
    placeHolders.push(`%I`);
    args.push(`S${field}`);
  });
  args.push(
    items.map((item) => {
      const structured =
        (typeof item === 'object' && item !== null) || Array.isArray(item);
      return fields.map((field) =>
        structured ? JSON.stringify(item[field]) : item[field],
      );
    }),
  );
  console.log(`Inserting data into table ${tableName} with fields ${fields}:`, items);
  const insertQuery = withArray(
    `INSERT INTO %s (${placeHolders}) VALUES %L ON CONFLICT ("S${idField}") DO NOTHING`,
    args,
  );
  // console.log(insertQuery);
  // throw new Error('stop');
  return client.query(insertQuery);
}
