import { translationFunctions, FrontDocument } from './translation.js';


async function insertFrontDocument(frontDoc: FrontDocument): Promise<void> {
  console.log('Inserting document into Front system with params:', frontDoc);
  // Here you would add the logic to insert the document into the Front system
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertData(tableName: string, items: any[], _fields: any): Promise<void> {
  void _fields;
  console.log(`Fetched data:`, items);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await Promise.all(items.map(async (item: any): Promise<void> => {
    const frontItem = translationFunctions[tableName].fn(item, translationFunctions[tableName].context);
    await insertFrontDocument(frontItem);
  }));
}