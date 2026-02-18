# Syncables

This repository contains a sync engine that can be used to download (and in the future also update) a collection of objects from an API. It can be configured declaratively by extending the OpenAPI spec.

Find the path that can be used to fetch a (paged) collection of items. This will typically look something like this:

```yaml
paths:
 /widgets:
    get:
      parameters:
        - description: Token specifying which result page to return. Optional.
          in: query
          name: pageToken
          schema:
            type: string
      responses:
        "200":
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CalendarList"
components:
  schemas:
    CalendarList:
      properties:
        results:
          items:
            properties:
              backgroundColor:
                type: string
          type: array
        nextPageToken:
          description: Token used to access the next page of this result. Omitted if no further results are available.
          type: string
      type: object
```

Under `paths['/widgets']['get']['responses']['200']['content']['application/json']`, add an object `syncable`, in which you can specify:
* `type`: `collection` or `item`. Defaults to `collection`.
* `name`: a `string` descriptor of the collection, e.g. `"widgets"`
* `paginationStrategy`: one of `pageNumber`, `offset`, `pageToken`, `dateRange`, `rangeHeader`,`confirmationBased`, or `none`.
* `query`: an object containing query parameters to add in addition to the pagination-related ones
* `itemsPathInResponse`: path within the response body schema, as an array of strings, that contains the array of items (default: `[]` for the response body root)
* `defaultPageSize`: tell Syncable how many items per page (max) to expect by default
* `forcePageSize`: if possible, let Syncable tell the API which page size to use (not applicable to pagination strategy `dateRange`)
* when using `forcePageSize`, you can add `forcePageSizeParamInQuery` if it's not `pageSize` (not applicable to pagination strategies `dateRange` and `rangeHeader`).
* for a `pageNumber` pagination strategy, you can add `pageNumberParamInQuery` if it's not `page`.
* for an `offset` pagination strategy, you can add `offsetParamInQuery` if it's not `offset`.
* for a `pageToken` pagination strategy, you can add `pageTokenParamInQuery` if it's not `pageToken` and `pageTokenPathInResponse` if it's not `['nextPageToken']`
* for a `dateRange` pagination strategy, you can add `startDateParamInQuery` if it's not `startDate`, `endDateParamInQuery` if it's not `endDate`, `startDate` if it's not `'20000101000000'`, and `endDate` if it's not `'99990101000000'`
* for a `confirmationBased` pagination strategy, `confirmOperation.path` and `confirmOperation.method`. Then at that operation, you can add `confirmOperation.pathTemplate`.
* `idField` to indicate which property of response items is used as the unique identifier (currently only used for confirmationBased pagination).
* `params` for templated syncables an object whose keys are template identifiers like `calendarId` and whose values are fields from other syncables, like `calendars.id`. Use with care, because it will try to exhaustively fetch collections for all combinations of parameters.

## Usage
### Create the OAD
You start with an OAD, for instance one from [here](https://github.com/tubsproject/syncables/tree/main/openapi/oad).
Probably the API you want to use is not specifying syncables yet, so you'll need to add those yourself using an overlay, something like the ones you see [here](https://github.com/tubsproject/syncables/tree/main/openapi/overlay).
To compute the effect of the overlay you can run a command like:
```sh
./node_modules/.bin/overlayjs --openapi ./openapi/oad/acube-peppol.yaml --overlay ./openapi/overlay/acube-peppol-overlay.yaml > openapi/generated/acube.yaml
```
### Generate the type
Assuming you're working in TypeScript, you can benefit from generating types from the OAD, like so:
```ts
npx openapi-typescript openapi/generated/acube.yaml -o ./src/types/acube.d.ts
```
### Install syncables
Depending on your preferred package manager, you can run something like this to install [syncables from npm](https://www.npmjs.com/package/syncables):
```sh
pnpm install syncables
```

### Write your code
Now you have the AOD with the definition of the syncable, and the type for the items you will sync, you can write code like [this](./src/readme-example.ts):
```ts
import { readFileSync } from 'fs';
import { components } from './types/google-calendar.js';
import { Syncer } from './syncer.js';

type Entry = components['schemas']['CalendarListEntry'];
const specFilename = './openapi/generated/google-calendar.yaml';
const specStr = readFileSync(specFilename).toString();

const syncer = new Syncer({
  specStr,
  authHeaders: {
    Authorization: `Bearer ${process.env.GOOGLE_BEARER_TOKEN}`,
  },
  dbConn:
    'postgresql://syncables:syncables@localhost:5432/syncables?sslmode=disable',
});

const allTables = await syncer.fullFetch();
// Data coming out of Syncer adheres to types from .d.ts files, autocomplete works for this in VS Code, e.g.:
const calendarEntries: Entry[] = allTables.calendars as Entry[];
console.log(calendarEntries[0].backgroundColor);
```

## Dev Example
* In the [Google Cloud Dashboard](https://console.cloud.google.com/apis/credentials) create an OAuth client ID with http://localhost:8000 as an authorized JavaScript origin and http://localhost:8000/callback as an authorized redirect URI.
* Enable the [calendar API](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com)
* Set the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables. Check: `echo $GOOGLE_CLIENT_ID and $GOOGLE_CLIENT_SECRET`
* `pnpm build`
* Similarly you can set MONEYBIRD_CLIENT_ID and MONEYBIRD_CLIENT_SECRET.
* Now you can run the example:
```sh
docker compose up -d
pnpm start
pnpm start events,contacts
docker exec -it db psql postgresql://syncables:syncables@localhost:5432/syncables -c "\d+"
```
It will check for existing bearer tokens in the `.tokens` folder and initiate OAuth flows as needed.
API responses will be cached in the `.fetch-cache` folder for easier development.

## Development
```sh
git clone https://github.com/tubsproject/syncables
cd syncables
pnpm install
pnpm generate
pnpm build
pnpm test
docker exec -it db psql postgresql://syncables:syncables@localhost:5432/db_unit_tests -c "\d+"
pnpm prettier
pnpm login
pnpm publish
```

## Acknowledgements
The `__tests__/integration/mock-server' folder is a copy of [`@scalar/mock-server`](https://github.com/scalar/scalar/blob/main/packages/mock-server/src) - thanks [Scalar](https://scalar.com)!