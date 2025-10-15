import { fromAcube, fromIon, fromPeppyrus, fromRecommand, FrontDocument } from './translation.js';


async function insertFrontDocument(frontDoc: FrontDocument): Promise<void> {
  console.log('Inserting document into Front system with params:', frontDoc);
  // Here you would add the logic to insert the document into the Front system
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertData(tableName: string, items: any[], _fields: any): Promise<void> {
  void _fields;
  console.log(`Fetched data:`, items);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await Promise.all(items.map((item: any): Promise<void> => {
    let frontItem: FrontDocument;
    switch (tableName) {
      case 'acube_invoice':
        frontItem = fromAcube('invoice', item);
        break;
      case 'acube_creditnote':
        frontItem = fromAcube('creditnote', item);
        break;
      case 'peppyrus_message':
        frontItem = fromPeppyrus(item);
        break;
      case 'ion_sendTransactions':
        frontItem = fromIon('outgoing', item);
        break;
      case 'ion_receiveTransactions':
        frontItem = fromIon('incoming', item);
        break;
      case 'arratech_fromnetwork':
        console.log('Inserting data into Arratech system...');
        // Here you would add the logic to insert data into the Arratech system
        break;
      case 'arratech_tonetwork':
        console.log('Inserting data into Arratech system...');
        // Here you would add the logic to insert data into the Arratech system
        break;
      case 'maventa_invoices':
        console.log('Inserting data into Maventa system...');
        // Here you would add the logic to insert data into the Maventa system
        break;
      case 'recommand_documents':
        frontItem = fromRecommand('outgoing', item);
        break;
      case 'recommand_inbox':
        frontItem = fromRecommand('incoming', item);
        break;
      default:
        console.log(`No insertion logic defined for table: ${tableName}`);
    }
    insertFrontDocument(frontItem);
    return Promise.resolve(void 0);
  }));
}