const arr = [];
for (let i = 0; i < 37; i += 1) {
  arr.push({
    "companyId": "string",
    "countryC1": "string",
    "createdAt": "string",
    "direction": "incoming",
    "docTypeId": "string",
    "emailRecipients": [
      "string",
    ],
    "id": "string",
    "parsed": {
      "...": "[Additional Properties Truncated]",
      "buyer": {
        "city": "Brussels",
        "country": "BE",
        "name": "Example Company",
        "postalZone": "1000",
        "street": "Example Street 1",
        "street2": "Suite 100",
        "vatNumber": "BE0123456789",
      },
      "buyerReference": "PO-2024-001",
      "dueDate": "2024-04-20",
      "invoiceNumber": "INV-2024-001",
      "issueDate": "2024-03-20",
      "note": "Thank you for your business",
      
      "paymentMeans": [
        {
          "iban": "BE1234567890",
          "paymentMethod": "credit_transfer",
          "reference": "INV-2026-001",
        },
      ],
      "paymentTerms": {
        "note": "Net 30",
      },
      "purchaseOrderReference": "PO-2024-001",
      "seller": {
        "city": "Brussels",
        "country": "BE",
        "name": "Example Company",
        "postalZone": "1000",
        "street": "Example Street 1",
        "street2": "Suite 100",
        "vatNumber": "BE0123456789",
      },
    },
    "updatedAt": "string",
    "processId": "string",
    "readAt": "string",
    "receiverId": "string",
    "senderId": "string",
    "sentOverEmail": true,
    "sentOverPeppol": true,
    "teamId": "string",
    "type": "invoice",  "updatedAt": "string",
    "xml": "string",
  });
}
export default arr;

