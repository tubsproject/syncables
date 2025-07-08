# Syncables

Access to data objects and collections is one important functionality of many APIs. Sync engines require quite some boilerplate to keep an up-to-date local copy of a collection that the API exposes.

To make this easier, we introduce a new field in OpenAPI specs, apart from `paths` and `components`, named `syncables`.

Whereas existing use of OpenAPI is mostly syntactical and human-readable (it specifies the schemas of API endpoints but the information on how to use them is only in the human-readable descriptions), OpenAPI Syncables aim to provide all the machine-readable information needed by a sync engine.

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
With that, the demo implementation in the `src` folder of this repo can generate an SQL table schema.

## Usage
Here is a demo of the syncables for Google Calendar API.
* Go to [Google API Explorer](https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/list), open the browser's developer tools, and execute the query using the APIs Explorer on the right.
* On the network tab of the browser developer tools, find the request that went to calendarList?key=..., copy the bearer token from the Authorization request header, and run `export GOOGLE_ACCESS_TOKEN=ya29.a0AS3...`
* Get the API key from the url query parameter and run `export GOOGLE_API_KEY=AIzaSyBeo4NGA__U6Xxy-aBE6yFm19pgq8TY-TM`.
* Run `echo $GOOGLE_API_KEY and $GOOGLE_ACCESS_TOKEN` to check.

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
