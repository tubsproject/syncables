import { XMLParser } from 'fast-xml-parser';

export function parseDocument(documentXml: string): {
  sender: string | undefined;
  recipient: string | undefined;
  docType: string | undefined;
  senderName?: string;
  recipientName?: string;
  amount?: number;
  docId?: string;
  issueDate: Date | undefined;
  dueDate: Date | undefined;
  paymentTermsNote: string | undefined;
} {
  const parserOptions = {
    ignoreAttributes: false,
    numberParseOptions: {
      leadingZeros: false,
      hex: true,
      skipLike: /(?:)/, // Disable number parsing
    },
  };
  const parser = new XMLParser(parserOptions);
  const jObj = parser.parse(documentXml);
  if (!jObj) {
    throw new Error('Failed to parse XML document');
  }
  if (Object.keys(jObj)[0] !== '?xml') {
    throw new Error('Missing top level ?xml declaration');
  }
  const docType = Object.keys(jObj)[1];
  if (!docType) {
    throw new Error('Could not determine document type from XML');
  }
  const sender = jObj[docType]?.['cac:AccountingSupplierParty']?.['cac:Party'];
  const recipient =
    jObj[docType]?.['cac:AccountingCustomerParty']?.['cac:Party'];
  if (!sender?.['cbc:EndpointID']?.['#text']) {
    throw new Error('Missing sender EndpointID text');
  }
  if (!recipient?.['cbc:EndpointID']?.['#text']) {
    throw new Error('Missing recipient EndpointID text');
  }
  return {
    sender: sender?.['cbc:EndpointID']?.['#text'],
    senderName: sender?.['cac:PartyName']?.['cbc:Name'],
    recipient: recipient?.['cbc:EndpointID']?.['#text'],
    recipientName: recipient?.['cac:PartyName']?.['cbc:Name'],
    amount: parseFloat(
      jObj[docType]?.['cac:LegalMonetaryTotal']?.['cbc:PayableAmount']?.[
        '#text'
      ],
    ),
    docType:
      docType === 'Invoice'
        ? 'Invoice'
        : docType === 'CreditNote'
          ? 'CreditNote'
          : undefined,
    docId: jObj[docType]?.['cbc:ID'],
    issueDate: jObj[docType]?.['cbc:IssueDate']
      ? new Date(jObj[docType]?.['cbc:IssueDate'])
      : undefined,
    dueDate: jObj[docType]?.['cbc:DueDate']
      ? new Date(jObj[docType]?.['cbc:DueDate'])
      : undefined,
    paymentTermsNote:
      jObj[docType]?.['cac:PaymentTerms']?.['cbc:Note'] || undefined,
  };
}

const INVOICES = {
  documentTypeScheme: 'busdox-docid-qns',
  documentType:
    'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2::Invoice##urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0::2.1',

  processScheme: 'cenbii-procid-ubl',
  process: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
};

export function toPeppyrusMessageBody(ubl: string): string {
  const parsed = parseDocument(ubl);
  return JSON.stringify({
    sender: parsed.sender,
    recipient: parsed.recipient,
    processType: `${INVOICES.processScheme}::${INVOICES.process}`,
    documentType: `${INVOICES.documentTypeScheme}::${INVOICES.documentType}`,
    fileName: 'invoice.xml',
    fileContent: Buffer.from(ubl).toString('base64'),
  });
}
