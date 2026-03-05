## Pagination schemes found on apis.guru

Something similar has been tried in the past with [x-ms-pageable](https://github.com/stankovski/AutoRest/blob/master/Documentation/swagger-extensions.md) but not at this scale.

## spec
So far I've seen the following server-side mechanisms to support client-side paging mechanisms:
* nextPageLink in the response
* page number parameter
* offset parameter
* token in response and parameter
* last item id parameter
* page size control and reporting
* reporting of total count / number of pages

* page size parameter
So each scheme needs:
* `paginate`: JSON path in result that is paginated by this scheme. Can be an array if it varies.
* at least one of `pageNumber` (P), `offset` (P), `lastItemId` (P), `nextPageLink` (R) or `token` (P,R)
* optionally `pageSize` (P), `totalCount` (R), `pageCount` (R), `lastPageLink` (R), `previousPageLink` (R), `currentPageLink` (R), `firstPageLink` (R), `hasNext` (R) and `hasPrevious` (R).
* `pageSize` can additionally have `minimum`, `default` and `maximum`, but this can be found in the schema definition.
* (P) means it needs `parameter` or `requestBody`
* (R) means it needs `responseBody` or `responseHeader`
* all pagination schemes will be applied to all GET endpoints that have all the specified parameters, response body fields, and response headers

## found
I found the following schemes by searching for 'pag' and `offset` (case-insensitive):


### 1password.local
```yaml
paginate: $
offset:
  parameter: offset
pageSize:
  parameter: limit
```

### adyen
```yaml
paginate:
  - balanceAccounts
  - paymentInstruments
  - accountHolders
  - data
offset:
  parameter: offset
pageSize:
  parameter: limit
hasNext:
  responseBody: hasNext
hasPrevious:
  responseBody: hasPrevious
```

### adyen admin
```yaml
paginate: data
offset:
  parameter: offset
pageSize:
  parameter: limit
```

### amadeus
```yaml
paginate: data
offset:
  parameter: pageOffset
pageSize:
  parameter: pageLimit
  default: 10
nextPageLink:
  responseBody: meta.links.next
totalCount:
  responseBody: meta.count
```

### bigredcloud
```yaml
paginate: $.Items
nextPageLink:
  responseBody: NextPageLink
```

### bikewise
```yaml
paginate: ?
pageNumber:
  parameter: page
pageSize:
  parameter: per_page
```

### billingo
```yaml
paginate: $.data
pageNumber:
  parameter: page
  responseBody: current_page
pageSize:
  parameter: per_page
nextPageLink:
  responseBody: next_page_url
totalCount:
  responseBody: total
pageCount:
  responseBody: last_page
previousPageLink:
  responseBody: prev_page_url
```

### Botify
```yaml
paginate: $.results
pageNumber:
  parameter: page
  responseBody: page
pageSize:
  parameter: size
  responseBody: size
totalCount:
  responseBody: count
previousPageLink:
  responseBody: previous
```
### Core.ac.uk
```yaml
paginate: $.data
pageNumber:
  parameter: page
pageSize:
  parameter: pageSize
```

### dev.to Chat GPT
```yaml
paginate: $ # ? - it seems #/components/schemas/getArticlesResponse describes a single item
pageNumber:
  parameter: page
pageSize:
  parameter: per_page
```

### evetech
```yaml
paginate: $
pageNumber:
  parameter: page
maxPageNumber:
  responseBodyHeader: X-Pages
```
### id4i
```yaml
paginate: elements
offset:
  parameter: offset
  responseBody: offset
pageSize:
  parameter: limit
  responseBody: limit
totalCount:
  responseBody: total
```

### meshery.local
```yaml
paginate: results
pageNumber:
  parameter: ?
  responseBody: page
pageSize:
  parameter: ?
  responseBody: page_size
totalCount:
  responseBody: total_count
```

### microcks
```yaml
paginate: $ # ? - it seems #/components/schemas/ImportJob describes a single item
pageNumber:
  parameter: page
pageSize:
  parameter: size 
```

### microsoft cognitive services (ImageSearch, LocalSearch, NewsSearch)
```yaml
paginate: value
offset:
  parameter: offset
nextOffset:
  responseBody: nextOffset
pageSize:
  parameter: count
totalCount:
  responseBody: totalEstimatedMatches
```

### microsoft cognitive services (Ocr)
```yaml
# I'm not actually sure whether this is pagination; I'm guessing it refers to book pages in the context of OCR
paginate: recognitionResults.lines
paginate: recognitionResult.lines
pageNumber:
  responseBody: page
```

### microsoft cognitive services (Training)
```yaml
paginate: results
token:
  requestBody: continuation,session
  responseBody: token.continuation,token.session
totalCount:
  responseBody: token.maxCount
  ```

### microsoft x-ms-pageable graph
```yaml
paginate: value
nextPageLink:
  responseBody: @odata.nextLink
totalCount:
  responseBody: @odata.count
```

### mineskin
```yaml
paginate: skins
pageNumber:
  responseBody: page.index
lastItemId:
  parameter: page # in URL path!
  responseBody: page.index
pageSize:
  responseBody: page.amount
totalCount:
  respopnseBody: page.total
```

### netboxdemo
```yaml
paginate: results
offset:
  parameter: offset
nextPageLink:
  responseBody: next
previousPageLink:
  responseBody: previous
pageSize:
  parameter: limit
totalCount:
  responseBody: count
```
### orghunter
```yaml
pageSize:
  parameter: rows
  default: 20
```

### ote-godaddy abuse / certificates / orders / subscriptions
```yaml
paginate:
  - ticketIds
  - certificates
  - orders
  - subscriptions
offset:
  parameter: offset
pageSize:
  parameter: limit
  default: 100
  maximum: 100
firsttPageLink:
  responseBody: pagination.first
previousPageLink:
  responseBody: pagination.previous
nextPageLink:
  responseBody: pagination.next
lastPageLink:
  responseBody: pagination.last
```

### ote-godaddy domains
```yaml
paginate: $
offset:
  parameter: offset
pageSize:
  parameter: limit
```

### oxforddictionaries
```yaml
paginate: results
offset:
  parameter: offset
pageSize:
  parameter: limit
  default: 5000
  maximum: 5000
firsttPageLink:
  responseHeader: link.first
previousPageLink:
  responseHeader: link.prev
currentPageLink:
  responseHeader: link.self
nextPageLink:
  responseHeader: link.next
lastPageLink:
  responseHeader: link.last
```

### Papinet
```yaml
paginate:
  - orders
  - orderLineItems
offset:
  parameter: offset
pageSize:
  parameter: limit
firstPageLink:
  responseBody: links.first
previousPageLink:
  responseBody: links.prev
nextPageLink:
  responseBody: links.next
lastPageLink:
  responseBody: links.last
```

### Reverb
```yaml
paginate:
pageNumber:
  parameter: page
pageSize:
  parameter: per_page
offset:
  parameter: offset
```

### theracingapi
```yaml
paginate: results
offset:
  parameter: offset
pageSize:
  parameter: limit
  responseBody: limit
totalCount:
  responseBody: total
  ```

### vonage
```yaml
paginate: _embedded.call_logs
pageNumber:
  parameter: page
  responseBody: page
pageSize:
  parameter: page_size
  responseBody: page_size
totalCount:
  responseBody: total_count
numPages:
  responseBody: total_page
firstPageLink:
  responseBody: _links.first
previousPageLink:
  responseBody: _links.prev
nextPageLink:
  responseBody: _links.next
currentPageLink:
  responseBody: _links.self
```
### Zeno
```yaml
paginate: items
pageNumber:
  parameter: page
pageSize:
  parameter: hitsPerPage
totalCount:
  responseBody: total
```

### Zoom
```yaml
paginate: accounts
token:
  parameter: next_page_token
  responseBody: next_page_token
pageNumber:
  responseBody: page_number
# DEPRECATED: parameter: page_number
pageSize:
  parameter: page_size
totalCount:
  responseBody: total_records
pageCount:
  responseBody: page_count
```
