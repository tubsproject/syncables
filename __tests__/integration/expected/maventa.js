const arr = [];
for (let i = 0; i < 37; i += 1) {
  arr.push({
    "actions": [
      {
        "channel": "EINVOICE",
        "happened_at": "2026-02-10T02:52:04.729Z",
        "key": "action_created",
        "message": "string",
        "type": "RECEIVED",
      },
    ],
    "comment": "string",
    "created_at": "2026-02-10T02:52:04.729Z",
    "currency": "string",
    "date": "2026-02-10",
    "date_due": "2026-02-10",
    "destination": "string",
    "files": [
      {
        "filename": "string",
        "href": "string",
        "id": "string",
        "mimetype": "string", 
        "type": "string",
      },
    ],
    "id": "string",
    "number": "string",
    "origin": "INTERNAL",
    "origin_type": "SCAN_PDF",
    "received_at": "2026-02-10T02:52:04.729Z",
    "recipient": {
      "bid": "string",
      "country": "string",
      "eia": "string",
      "name": "string",
      "operator": "string",
    },
    "reference": "string",
    "revision": {},
    "sender": {
      "bid": "string",
      "country": "string",
      "eia": "string",
      "name": "string",
    },
    "source_format": "string",
    "status": "PENDING",
    "sum": 1,
    "sum_tax": 1  
  });
}
export default arr;

