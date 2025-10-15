export type FrontDoc = {
    docType: 'invoice' | 'creditnote',
    direction: 'incoming' | 'outgoing',
    senderId: string,
    receiverId: string,
    createdAt: Date,
    platformId: string,
}

const DOC_TYPE_MAP: { [key: string]: 'invoice' | 'creditnote' } = {
  'busdox-docid-qns::urn:oasis:names:specification:ubl:schema:xsd:Invoice-2::Invoice##urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0::2.1': 'invoice',
  'busdox-docid-qns::urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2::CreditNote##urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0::2.1': 'creditnote',
};
const DIRECTION_MAP: { [key: string]: 'incoming' | 'outgoing' } = {
  'OUT': 'outgoing',
  'IN': 'incoming',
};

async function insertFrontDocument(frontDoc: FrontDoc): Promise<void> {
  console.log('Inserting document into Front system with params:', frontDoc);
  // Here you would add the logic to insert the document into the Front system
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertData(tableName: string, items: any[], _fields: any): Promise<void> {
  void _fields;
  console.log(`Fetched data:`, items);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await Promise.all(items.map((item: any): Promise<void> => {
    switch (tableName) {
      case 'acube_invoice':
        console.log('Inserting Acube invoice..', item);
        return insertFrontDocument({
            
          platformId: `acube:${item.uuid}`,
          docType: 'invoice',
          direction: item.direction,
          senderId: item.sender.identifier,
          receiverId: item.recipient.identifier,
          createdAt: new Date(item.createdAt),
        });
      case 'acube_creditnote':
        console.log('Inserting Acube creditnote..', item);
        return insertFrontDocument({
          platformId: `acube:${item.uuid}`,
          docType: 'creditnote',
          direction: item.direction,
          senderId: item.sender.identifier,
          receiverId: item.recipient.identifier,
          createdAt: new Date(item.createdAt),
        });
      case 'peppyrus_message':
        console.log('Inserting Peppyrus message..', item);
        return insertFrontDocument({
          platformId: `peppyrus:${item.uuid}`,
          docType: DOC_TYPE_MAP[item.documentType],
          direction: DIRECTION_MAP[item.direction],
          senderId: item.sender,
          receiverId: item.recipient,
          createdAt: new Date(item.created),
        });
      case 'ion_sendTransactions':
        console.log('Inserting Ion send transaction.', item);
        return insertFrontDocument({
          platformId: `ion:${item.id}`,
          docType: DOC_TYPE_MAP[item.document_element],
          direction: 'outgoing',
          senderId: item.sender_identifier,
          receiverId: item.receiver_identifier,
          createdAt: new Date(item.created_on),
        });
      case 'ion_receiveTransactions':
        console.log('Inserting Ion receive transaction.', item);
        return insertFrontDocument({
          platformId: `ion:${item.id}`,
          docType: DOC_TYPE_MAP[item.document_element],
          direction: 'incoming',
          senderId: item.sender_identifier,
          receiverId: item.receiver_identifier,
          createdAt: new Date(item.created_on),
        });
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
        console.log('Inserting Recommand document.', item);
        return insertFrontDocument({
          platformId: `recommand:${item.id}`,
          docType: DOC_TYPE_MAP[item.docTypeId],
          direction: 'outgoing',
          senderId: item.senderId,
          receiverId: item.receiverId,
          createdAt: new Date(item.createdAt),
        });
      case 'recommand_inbox':
        console.log('Inserting Recommand document.', item);
        return insertFrontDocument({
          platformId: `recommand:${item.id}`,
          docType: DOC_TYPE_MAP[item.docTypeId],
          direction: 'incoming',
          senderId: item.senderId,
          receiverId: item.receiverId,
          createdAt: new Date(item.createdAt),
        });
      default:
        console.log(`No insertion logic defined for table: ${tableName}`);
    }
    return Promise.resolve(void 0);
  }));
}