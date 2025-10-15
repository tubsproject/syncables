import { components as acube } from './acube.d.js';
import { components as ion } from './ion.d.js';
// import { components as arratech } from './arratech.d.js';
// import { components as maventa } from './maventa.d.js';
import { components as peppyrus } from './peppyrus.d.js';
import { operations as recommand } from './recommand.d.js';
import { components as front } from './front.d.js';

const DOC_TYPE_MAP: { [key: string]: 'invoice' | 'creditnote' } = {
  'busdox-docid-qns::urn:oasis:names:specification:ubl:schema:xsd:Invoice-2::Invoice##urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0::2.1': 'invoice',
  'busdox-docid-qns::urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2::CreditNote##urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0::2.1': 'creditnote',
};
const DIRECTION_MAP: { [key: string]: 'incoming' | 'outgoing' } = {
  'OUT': 'outgoing',
  'IN': 'incoming',
};

async function insertFrontDocument(frontDoc: front["schemas"]["Document"]): Promise<void> {
  console.log('Inserting document into Front system with params:', frontDoc);
  // Here you would add the logic to insert the document into the Front system
}

function fromAcube(docType: 'invoice' | 'creditnote', item: acube["schemas"]["Invoice.InvoiceOutput.jsonld"] | acube["schemas"]["CreditNote.CreditNoteOutput.jsonld"]): front["schemas"]["Document"] {
  console.log('Inserting Acube document...', item);
  return {
    platformId: `acube:${item.uuid}`,
    docType,
    direction: item.direction,
    senderId: item.sender.identifier,
    receiverId: item.recipient.identifier,
    createdAt: item.createdAt,
  };
}

function fromPeppyrus(item: peppyrus["schemas"]["Message"]): front["schemas"]["Document"] {
  return {
    platformId: `peppyrus:${item.id}`,
    docType: DOC_TYPE_MAP[item.documentType],
    direction: DIRECTION_MAP[item.direction],
    senderId: item.sender,
    receiverId: item.recipient,
    createdAt: item.created,
  };
}

function fromIon(direction: 'incoming' | 'outgoing', item: ion["schemas"]["SendTransaction"] | ion["schemas"]["ReceiveTransaction"]): front["schemas"]["Document"] {
  return {
    platformId: `ion:${item.id}`,
    docType: DOC_TYPE_MAP[item.document_element],
    direction,
    senderId: item.sender_identifier,
    receiverId: item.receiver_identifier,
    createdAt: item.created_on,
  };
}

function fromRecommand(direction: 'incoming' | 'outgoing', item: recommand["getDocuments"]["responses"][200]["content"]["application/json"]["documents"][number]): front["schemas"]["Document"] {
  return {
    platformId: `recommand:${item.id}`,
    docType: DOC_TYPE_MAP[item.docTypeId],
    direction,
    senderId: item.senderId,
    receiverId: item.receiverId,
    createdAt: item.createdAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertData(tableName: string, items: any[], _fields: any): Promise<void> {
  void _fields;
  console.log(`Fetched data:`, items);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await Promise.all(items.map((item: any): Promise<void> => {
    let frontItem: front["schemas"]["Document"];
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