# Work in Progress

Access to data objects and collections is one important functionality of many APIs. Sync engines require quite some boilerplate to keep an up-to-date local copy of a collection that the API exposes.

To make this easier, we introduce a new field in OpenAPI specs, apart from `paths` and `components`, named `syncables`.

Whereas existing use of OpenAPI is mostly at the request and response body level (it specifies their schemas but the information on how to use them is only in the human-readable descriptions), Syncables aim to provide all the machine-readable information needed by a sync engine.

A collection specifies details about a collection of data items that is available through the API in question,
namely how to fetch the entire collection, how to add/update/remove an item in the collection, which merge type to use in case of conflicts, etc.

For now, this first proof-of-concept only specifies which path retrieves the full collection, and which field in the response contains the retrieved items.

The `openapi/oad/google-calendar.yaml` file in this repo is an OpenAPI Document (OAD) for Google's Calendar API.
The `openapi/overlay/google-calendar-overlay.yaml` is a small OpenAPI Overlay that adds the following information into the root of the OAD:
```yaml
syncables:
  calendarList:
    description: |-
      Calendars of the currently authenticated user.
    type: collection
    get:
      path: /users/me/calendarList
      field: items
```
With that, the demo implementation in the `src` folder of this repo can create an SQL table and do a one-sweep sync of the collection from the remote API to this local database table.
It's still a work in progress and very brittle.

## Show case 1: Google Calendar
This repository contains two show cases. The first one is [Google Calendar](https://github.com/tubsproject/syncables/blob/main/openapi/overlay/google-calendar-overlay.yaml). Paging with the page token and sync token is not implemented yet, but the sync engine is able to create an SQL table and fill it with rows from the first page.
This show case is currently broken in the `main` branch, but you can still see it if you go back to [the `showcase-google-calendar` branch](https://github.com/tubsproject/syncables/tree/showcase-google-calendar?tab=readme-ov-file#usage).

## Show case 2: Peppol
The second show case centers around Peppol access points, which is also milestone 5 of [our NLNet project](./nlnet-milestones.md).
It looks at the APIs of the following Peppol Access-Point-as-as-Service (APaaS) providers:
1. [A-Cube](./openapi/oad/acube-peppol.yaml)
2. [Arratech](./openapi/oad/arratech-peppol.json)
3. [Bilberry](./openapi/oad/billberry-peppol.yaml)
4. [Dokapi](./openapi/oad/dokapi.json)
5. [e-invoice.be](./openapi/oad/e-invoice-be-peppol.json)
6. [Ion](./openapi/oad/ion-peppol.yaml)
7. [Maventa](./openapi/oad/maventa-peppol.yaml)
8. [Netfly](./openapi/oad/netfly-peppol.yaml)
9. [Peppyrus](./openapi/oad/peppyrus-peppol.yaml)
10. [Primexchange](./openapi/oad/primexchange-peppol.json)
11. [Recommand](./openapi/oad/recommand-peppol.yaml)
12. [Scrada](./openapi/oad/scrada-peppol.json)

Of these, we look at the collections of sent/received invoice/credit-note documents.

### Sharding and availability
In all cases, the way to retrieve document collections is to do a HTTP GET to get a JSON array. In most cases this can be safely be paged. First of all, let's look at difference in collection availability and sharding:
* a single endpoint for all sent/received invoice/credit-note documents `(7,10)`
* the API endpoint to use depends on the document type, there is one for sent/received invoices and one for sent/received credit notes `(1)`
* the API endpoint to use depends on the direction, there is one for sent invoices/credit notes and one for received invoices/credit notes `(2,3,5,6,8,9,11)`
* documents can not be listed, you need to [keep track of the webhooks](https://dev-portal.dokapi.io/docs/overviewsend) `(4)`
* outgoing documents can not be listed, incoming ones can be popped from a queue `(12)`

### Addition
To send a Peppol document (add it to the "sent" collection), there are a few patterns:
* upload XML in a POST `(1,2,5,6,7,8,12)`
* upload XML with PUT `(10)`
* POST JSON containing the XML string `(11)`
* POST JSON containing the base64-encoded XML string `(9)`
* outgoing documents require a JSON POST to get an upload URL, followed by a PUT of the XML `(4)`
* impossible `(3?)`

## Download document XML
* download the XML `(1,2?,3,5?,6,7,12)`
* download JSON containing the XML string `(11)`
* download JSON containing the base64-encoded XML string `(9)`
* download ZIP containing the XML document `(?)`
* GET JSON with a download URL for the XML `(10?)`
* POST JSON to get a download URl for the XML `(4)`
* impossible `(8?)`

### Paging mechanisms
Now let's look at paging mechanisms provided for each of these collections:
* page number and page size `(1,5,7,9,10,11)`
* offset and page size `(6)`
* page token and page size; a new page token is included in the response `(2)`
* page token and page size, followed by sync token; a new page/sync token is included in the response (we saw this in the Google Calendar API, but none if the 12 Peppol APIs use it)
* no way to do paging but you get a link to an "updates" URL `(3)`
* a queue rather than a collection; you only get the first page and can "confirm" items from there to make newer items show up `(12)`
* you can filter by date `(8)`
* not applicable `(4)`

### Lexical differences
Apart from these functional differences there are of course also lexical differences in API interactions:
* *page token in query*: `lastEvaluatedKey (2)`
* *page number in query*: `page (1,5,7,9,10,11)`
* *offset in query*: `offset (6)`
* *page size in query*: `page_size (5)`, `pagesize (10)`, `per_page (7)`, `perPage (9)`,  `itemsPerPage (1)`, `limit (2,6,11)`,
* *new page token in response body*: `pagination.lastEvaluatedKey (2)`
* *updates URL Link relation*: `updates (3)`
* *results array in response body*: `[none (root)] (3,7,8)`, `hydra:member (1)`, `items (2,5,9)`, `results (6,10,12)`, `documents (11)`
* the endpoint URLs are different for each API.

And in the schema for documents:
* ID (UUID or integer): `peppolMessage.uuid (1)`, `id (2,3,9)`, `transaction_id (6)`, `data.transfer_id (10)`, `invoice_id (5)`
* Document Type: `type: debit/credit (3)`, `docTypeId: urn.oasis... (2,11)`, `documentType: urn.oasis... (9)`, `document_element: Invoice / CreditNote (6)`, `documentType (8)`
* Direction: `documentFlow: TO_NETWORK/FROM_NETWORK (2)`, `direction: incoming/outgoing (11)`
* Sender ID: `sender.identifier (1)`, `senderId (2,11)`, `sender_peppol_scheme:sender_peppol_id (5)`, `sender_identifier (6)`, `sender.eia (7)`, `sender (8,9)`, `peppolSenderID (12)`
* Sender Name: `sender.name (1,7)`, `senderName (3)`,
* Receiver ID: `recipient.identifier (1)`, `receiverId (2,11)`, `receiver_peppol_scheme:receiver_peppol_id (5)`, `receiver_identifier (6)`, `recipient.eia (7)`, `recipient (8,9)`, `peppolReceiverID (12)`
* Receiver Name: `recipient.name (1,7)`, `receiverName (3)`, `
* Document ID: `number (3)`, `id (12)`, `invoice_id (5)`
* Issue Date: `date (3,7)`
* Due Date: `dueDate (3)`, `date_due (7)`, `due_date (5)`
* Receive Date: `receivedAt (3)` `validatedAt (5)`, `received_at (7)`, `peppolC3Timestamp (12)`
* Send Date: `peppolMessage.createdAt (1)`, `createdAt (2,11)`, `sentAt (3)`, `created_on (6)`, `created_at (7)`, `inputDate (8)`, `peppolC2Timestamp (12)`, `data.created_at (10)`


## Usage
Here is a demo of the syncables we use in the Let's Peppol proxy service.

Some one-liners to obtain some of the API access tokens:
```sh
export $(xargs < ./.env)
export MAVENTA_TOKEN=`curl -X POST https://ax-stage.maventa.com/oauth2/token -H "Content-Type: application/json" -d "{
  \"client_id\": \"$MAVENTA_CLIENT_ID\",
  \"client_secret\": \"$MAVENTA_CLIENT_SECRET\",
  \"vendor_api_key\": \"$MAVENTA_VENDOR_API_KEY\",
  \"grant_type\": \"client_credentials\"
}" | json access_token`

export ARRATECH_TOKEN=`curl -X POST https://cognito-idp.eu-central-1.amazonaws.com/ -H "Content-Type: application/x-amz-json-1.1" -H "X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth" -d "{                                 
  \"AuthFlow\": \"USER_PASSWORD_AUTH\",
  \"AuthParameters\": {
    \"USERNAME\": \"$ARRATECH_USERNAME\",
    \"PASSWORD\": \"$ARRATECH_PASSWORD\"
  },                                          
  \"ClientId\": \"5rbbg79c6q9010deju24kf0vq4\"
}" | json AuthenticationResult.AccessToken`

export ACUBE_TOKEN=`curl -X POST \
  https://common-sandbox.api.acubeapi.com/login \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"email": "'"${ACUBE_USR}"'", "password": "'"${ACUBE_PWD}"'"}' | json token`

export NETFLY_TOKEN=`curl --request POST   --url https://netfly-test.eu.auth0.com/oauth/token   --header 'content-type: application/json'   --data '{
    "client_id":"'"${NETFLY_CLIENT_ID}"'",
    "client_secret":"'"${NETFLY_CLIENT_SECRET}"'",
    "audience":"https://netfly-test.eu.auth0.com/api/v2/",
    "grant_type":"client_credentials"
  }' | json access_token`
```

```sh
pnpm install
sh ./ts-gen.sh
pnpm build
docker compose up -d

# FIXME: get MAVENTA_TOKEN from https://testing.maventa.com/invoices/index/outbound

export ACUBE_AUTH_HEADERS="{\"Authorization\":\"Bearer "${ACUBE_TOKEN}"\"}"
export PEPPYRUS_AUTH_HEADERS="{\"X-Api-Key\":\""$PEPPYRUS_TOKEN_TEST"\"}"
export ION_AUTH_HEADERS="{\"Authorization\":\"Token "$ION_API_KEY"\"}"
export ARRATECH_AUTH_HEADERS="{\"Authorization\":\"Bearer "$ARRATECH_TOKEN"\"}"
export RECOMMAND_AUTH_HEADERS="{\"Authorization\":\"Basic "`echo -n $RECOMMAND_API_KEY:$RECOMMAND_API_SECRET | base64`"\"}"
export MAVENTA_AUTH_HEADERS="{\"Authorization\":\"Bearer "$MAVENTA_TOKEN"\"}"
export NETFLY_AUTH_HEADERS="{\"Authorization\":\"Bearer "$NETFLY_TOKEN"\"}"
export SCRADA_AUTH_HEADERS="{\"X-API-KEY\":\""$SCRADA_API_KEY"\",\"X-PASSWORD\":\""$SCRADA_API_PWD"\"}"

# FIXME: we should do this with the `createSqlTable` function from `src/db.ts`:
docker exec -it db psql postgresql://syncables:syncables@localhost:5432/syncables -c "create type direction as enum ('incoming', 'outgoing');"
docker exec -it db psql postgresql://syncables:syncables@localhost:5432/syncables -c "create type docType as enum ('invoice', 'credit-note');"
docker exec -it db psql postgresql://syncables:syncables@localhost:5432/syncables -c "create table FrontDocs (senderId text, senderName text, receiverId text, receiverName text, docType docType, direction direction, docId text, amount numeric, platformId text primary key, createdAt timestamp, issueDate timestamp, dueDate timestamp, paid timestamp, paymentTermsNote text, ubl text);"

node build/src/cron.js
docker exec -it db psql postgresql://syncables:syncables@localhost:5432/syncables -c "\d+"
docker exec -it db psql -P pager postgresql://syncables:syncables@localhost:5432/syncables -c "select * from recommand_documents limit 1;"
docker exec -it db psql -P pager postgresql://syncables:syncables@localhost:5432/syncables -c "select * from acube_invoice limit 1;"
docker exec -it db psql -P pager postgresql://syncables:syncables@localhost:5432/syncables -c "select * from ion_receivetransactions limit 1;"
docker exec -it db psql -P pager postgresql://syncables:syncables@localhost:5432/syncables -c "select * from peppyrus_message limit 1;"
```
Output:
```
 accessrole | backgroundcolor | colorid | deleted | description | etag | foregroundcolor | hidden | id | kind | location | primary_ | selected | summary | summaryoverride | timezone 
------------+-----------------+---------+---------+-------------+------+-----------------+--------+----+------+----------+----------+----------+---------+-----------------+----------
...
```
This is just a first example of how it would create an SQL database schema and populate it with some data from an API. We plan to extend this repo with a fully functional sync engine that can act as a reference implementation of OpenAPI Syncables.

This work is [sponsored by NLNet](https://nlnet.nl/project/TUBS/)
