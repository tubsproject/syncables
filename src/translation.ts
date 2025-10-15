import { components as acube } from './acube.d.js';
import { components as ion } from './ion.d.js';
// import { components as arratech } from './arratech.d.js';
// import { components as maventa } from './maventa.d.js';
import { components as peppyrus } from './peppyrus.d.js';
import { operations as recommand } from './recommand.d.js';
import { components as front } from './front.d.js';

export type AcubeDocument = acube["schemas"]["Invoice.InvoiceOutput.jsonld"] | acube["schemas"]["CreditNote.CreditNoteOutput.jsonld"];
export type PeppyrusDocument = peppyrus["schemas"]["Message"];
export type IonDocument = ion["schemas"]["SendTransaction"] | ion["schemas"]["ReceiveTransaction"];
// export type ArratechDocument = arratech["schemas"]["FromNetwork"] | arratech["schemas"]["ToNetwork"];
// export type MaventaDocument = maventa["schemas"]["Invoice"];
export type RecommandDocument = recommand["getDocuments"]["responses"][200]["content"]["application/json"]["documents"][number];
export type FrontDocument = front["schemas"]["Document"];

const DOC_TYPE_MAP: { [key: string]: 'invoice' | 'creditnote' } = {
  'busdox-docid-qns::urn:oasis:names:specification:ubl:schema:xsd:Invoice-2::Invoice##urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0::2.1': 'invoice',
  'busdox-docid-qns::urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2::CreditNote##urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0::2.1': 'creditnote',
};
const DIRECTION_MAP: { [key: string]: 'incoming' | 'outgoing' } = {
  'OUT': 'outgoing',
  'IN': 'incoming',
};

export function fromAcube(docType: 'invoice' | 'creditnote', item: AcubeDocument): FrontDocument {
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

export function fromPeppyrus(item: PeppyrusDocument): FrontDocument {
  return {
    platformId: `peppyrus:${item.id}`,
    docType: DOC_TYPE_MAP[item.documentType],
    direction: DIRECTION_MAP[item.direction],
    senderId: item.sender,
    receiverId: item.recipient,
    createdAt: item.created,
  };
}

export function fromIon(direction: 'incoming' | 'outgoing', item: IonDocument): FrontDocument {
  return {
    platformId: `ion:${item.id}`,
    docType: DOC_TYPE_MAP[item.document_element],
    direction,
    senderId: item.sender_identifier,
    receiverId: item.receiver_identifier,
    createdAt: item.created_on,
  };
}

export function fromRecommand(direction: 'incoming' | 'outgoing', item: RecommandDocument): FrontDocument {
  return {
    platformId: `recommand:${item.id}`,
    docType: DOC_TYPE_MAP[item.docTypeId],
    direction,
    senderId: item.senderId,
    receiverId: item.receiverId,
    createdAt: item.createdAt,
  };
}