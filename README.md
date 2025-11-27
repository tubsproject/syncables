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

