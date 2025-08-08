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
Here is a demo of the syncables for Google Calendar API.
* In the [Google Cloud Dashboard](https://console.cloud.google.com/apis/credentials) create an OAuth 2.0 Client ID with http://localhost:8000 as an authorized JavaScript origin and http://localhost:8000/callback as an authorized redirect URI.
* Set the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables. Check: `echo $GOOGLE_CLIENT_ID and $GOOGLE_CLIENT_SECRET`
* Enable the [calendar API](https://console.cloud.google.com/apis/api/calendar-json.googleapis.com/overview?project=tubs-468405&inv=1&invt=Ab46Tw)


```sh
pnpm install
pnpm generate
pnpm build
docker compose up -d
pnpm start
docker exec -it db psql postgresql://syncables:syncables@localhost:5432/syncables -c "select * from data;"
```
Output:
```
 accessrole | backgroundcolor | colorid | deleted | description | etag | foregroundcolor | hidden | id | kind | location | primary_ | selected | summary | summaryoverride | timezone 
------------+-----------------+---------+---------+-------------+------+-----------------+--------+----+------+----------+----------+----------+---------+-----------------+----------
...
```
This is just a first example of how it would create an SQL database schema and populate it with some data from an API. We plan to extend this repo with a fully functional sync engine that can act as a reference implementation of OpenAPI Syncables.

This work is [sponsored by NLNet](https://nlnet.nl/project/TUBS/)
