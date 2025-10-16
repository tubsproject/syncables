import { Client } from './db.js';
import { translationFunctions, FrontDocument } from './translation.js';


async function insertFrontDocument(client: Client, frontDoc: FrontDocument): Promise<void> {
  console.log('Inserting document into Front system with params:', frontDoc);
  void client;
  // Here you would add the logic to insert the document into the Front system
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertData(client: Client, tableName: string, items: any[], _fields: any): Promise<void> {
  void _fields;
  console.log(`Fetched data:`, items);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await Promise.all(items.map(async (item: any): Promise<void> => {
    const frontItem = translationFunctions[tableName].fn(item, translationFunctions[tableName].context);
    await insertFrontDocument(client, frontItem);
  }));
}