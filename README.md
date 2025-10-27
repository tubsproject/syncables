# Syncables

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

## Usage
Here is a demo of the syncables we use in the Let's Peppol proxy service.

Some one-liners to obtain some of the API access tokens:
```sh
export $(xargs < ./.env)
curl -X POST https://ax-stage.maventa.com/oauth2/token -H "Content-Type: application/json" -d "{
  \"client_id\": \"$MAVENTA_CLIENT_ID\",
  \"client_secret\": \"$MAVENTA_CLIENT_SECRET\",
  \"vendor_api_key\": \"$MAVENTA_VENDOR_API_KEY\",
  \"grant_type\": \"client_credentials\"
}" | json

export ARRATECH_BEARER_TOKEN=`curl -X POST https://cognito-idp.eu-central-1.amazonaws.com/ -H "Content-Type: application/x-amz-json-1.1" -H "X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth" -d "{                                 
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
```

```sh
pnpm install
npx openapi-typescript ./openapi/oad/front.yaml -o ./src/front.d.ts
./node_modules/.bin/overlayjs --openapi ./openapi/oad/google-calendar.yaml --overlay ./openapi/overlay/google-calendar-overlay.yaml > google-calendar-generated.yaml
npx openapi-typescript ./google-calendar-generated.yaml -o ./src/google-calendar.d.ts
./node_modules/.bin/overlayjs --openapi ./openapi/oad/acube-peppol.yaml --overlay ./openapi/overlay/acube-peppol-overlay.yaml > acube-peppol-generated.yaml
npx openapi-typescript ./acube-peppol-generated.yaml -o ./src/acube.d.ts
./node_modules/.bin/overlayjs --openapi ./openapi/oad/peppyrus-peppol.yaml --overlay ./openapi/overlay/peppyrus-peppol-overlay.yaml > peppyrus-peppol-generated.yaml
npx openapi-typescript ./peppyrus-peppol-generated.yaml -o ./src/peppyrus.d.ts
./node_modules/.bin/overlayjs --openapi ./openapi/oad/ion-peppol.yaml --overlay ./openapi/overlay/ion-peppol-overlay.yaml > ion-peppol-generated.yaml
npx openapi-typescript ./ion-peppol-generated.yaml -o ./src/ion.d.ts
./node_modules/.bin/overlayjs --openapi ./openapi/oad/arratech-peppol.json --overlay ./openapi/overlay/arratech-peppol-overlay.yaml > arratech-peppol-generated.yaml
// FIXME  npx openapi-typescript ./arratech-peppol-generated.yaml -o ./src/arratech.d.ts
./node_modules/.bin/overlayjs --openapi ./openapi/oad/maventa-peppol.yaml --overlay ./openapi/overlay/maventa-peppol-overlay.yaml > maventa-peppol-generated.yaml
npx openapi-typescript ./maventa-peppol-generated.yaml -o ./src/maventa.d.ts
./node_modules/.bin/overlayjs --openapi ./openapi/oad/recommand-peppol.yaml --overlay ./openapi/overlay/recommand-peppol-overlay.yaml > recommand-peppol-generated.yaml
npx openapi-typescript ./recommand-peppol-generated.yaml -o ./src/recommand.d.ts
pnpm build
docker compose up -d

export ACUBE_AUTH_HEADERS="{\"Authorization\":\"Bearer ${ACUBE_TOKEN}\"}"
export PEPPYRUS_AUTH_HEADERS="{\"X-Api-Key\":\"$PEPPYRUS_TOKEN_TEST\"}"
export ION_AUTH_HEADERS="{\"Authorization\":\"Token $ION_API_KEY\"}"
# export ARRATECH_AUTH_HEADERS="{\"Authorization\":\"Bearer $_BEARER_TOKEN\"}"
# export MAVENTA_AUTH_HEADERS="{\"Authorization\":\"Basic `echo $RECOMMAND_API_KEY:$RECOMMAND_API_SECRET | base64`\"}"
# export RECOMMAND_AUTH_HEADERS="{\"Authorization\":\"Bearer $RECOMMAND_API_KEY\"}"

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
