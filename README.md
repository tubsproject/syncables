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
* `tokenStrategy`: one of `pageNumber`, `offset`, `pageToken` or `dateRange`
  * in case of `pageNumber`, you can add `pageParamNameInQuery` if it's not `page`.
  * in case of `offset`, you can add `offsetParamNameInQuery` if it's not `offset`.
  * in case of `pageToken`, you can add `pageTokenParamNameInQuery` if it's not `pageToken`
  * in case of `pageToken`, you can add `pageTokenParamNameInResponse` if it's not `pageToken`
  * in case of `dateRange`, you can add `startDateParamNameInQuery` if it's not `startDate`
  * in case of `dateRange`, you can add `endDateParamNameInQuery` if it's not `endDate`
* `query`: an object containing query parameters to add in addition to the paging-related ones  

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
import { components } from './src/types/google-calendar.js';
import { Syncable } from 'syncable';

type Entry = components['schemas']['CalendarListEntry'];
const specStr = readFileSync('./openapi/generated/google-calendar.yaml').toString();

const syncable = new Syncable<Entry>(specStr);
const data = await syncable.fullFetch();
console.log(data);
````

## Development
```sh
git clone https://github.com/tubsproject/syncables
cd syncables
pnpm install
pnpm generate
pnpm build
pnpm test
pnpm prettier
pnpm publish
```
