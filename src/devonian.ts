import { Client } from './db.js';
import { FrontDocument } from './translation.js';

async function insertFrontDocument(
  client: Client,
  frontDoc: FrontDocument,
): Promise<void> {
  console.log('Inserting document into Front system with params:', frontDoc);
  const fields = Object.keys(frontDoc);
  const keys = fields.join(', ');
  const values = fields.map((field) => `'${frontDoc[field]}'`).join(', ');
  // Here you would add the logic to insert the document into the Front system
  const insertQuery = `INSERT INTO FrontDocs (${keys}) VALUES (${values}) ON CONFLICT DO NOTHING`;
  // console.log(`Executing insert query: ${insertQuery}`);
  return client.query(insertQuery);
}

export async function insertData(
  client: Client,
  translationFunctions, 
  tableName: string,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[],
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  _fields: any,
): Promise<void> {
  void _fields;
  console.log(`Fetched data:`, items);
  await Promise.all(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    items.map(async (item: any): Promise<void> => {
      if (typeof translationFunctions[tableName] === 'undefined' || translationFunctions[tableName] === null) {
        throw new Error(`No translation function for table: ${tableName}`);
      }
      const frontItem = translationFunctions[tableName].fn(
        item,
        translationFunctions[tableName].context,
      );
      await insertFrontDocument(client, frontItem);
    }),
  );
}
