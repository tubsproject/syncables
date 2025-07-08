# Syncables

Access to data collections is one important functionality of many APIs. Sync engines require quite some boilerplate to keep an up-to-date local copy of a collection that the API exposes.

To make this easier, we introduce a new field in OpenAPI specs, apart from `paths` and `components`, named `collections`.

Whereas existing use of OpenAPI is mostly syntactical and human-readable (it specifies the schemas of API endpoints but the information on how to use them is only in the human-readable descriptions), OpenAPI Collections aim to provide all the machine-readable information needed by a sync engine.

A collection specifies details about a collection of data items that is available through the API in question,
namely how to fetch the entire collection, how to add/update/remove an item in the collection, which merge type to use in case of conflicts, etc.

For now, this first proof-of-concept only specifies which path retrieves the full collection, and which field in the response contains the retrieved items.

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
## Usage
```sh
pnpm install
pnpm generate
pnpm build
pnpm start
```
Output:
```
Resolved components in OpenAPI spec.
Creating syncable collection: calendarList

CREATE TABLE data(
  accessRole TEXT,
  backgroundColor TEXT,
  colorId TEXT,
  
  
  deleted BOOLEAN,
  description TEXT,
  etag TEXT,
  foregroundColor TEXT,
  hidden BOOLEAN,
  id TEXT,
  kind TEXT,
  location TEXT,
  
  primary BOOLEAN,
  selected BOOLEAN,
  summary TEXT,
  summaryOverride TEXT,
  timeZone TEXT,
) STRICT
```
This is just a first example of how it would create an SQL database schema. We plan to extend this repo with a fully functional sync engine that can act as a reference implementation of OpenAPI Collections.

This work is [sponsored by NLNet](https://nlnet.nl/project/TUBS/)
