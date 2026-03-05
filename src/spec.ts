import type { OpenAPIV3_1 } from '@scalar/openapi-types';

type PaginationStrategy = 
    | 'pageNumber'
    | 'offset'
    | 'pageToken'
    | 'dateRange'
    | 'rangeHeader'
    | 'confirmationBased'
    | 'linkHeader'
    | 'none';
export type SyncableSpecInput = {
  type: string;
  name: string;
  startDateParamInQuery?: string;
  endDateParamInQuery?: string;
  startDate?: string;
  endDate?: string;
  query?: { [key: string]: string };
  defaultPageSize?: number;
  forcePageSize?: number;
  idField?: string;
  confirmOperation?: {
    pathTemplate: string;
    method: string;
    path: string;
  };
  params?: { [key: string]: string };
};
export type SyncableSpec = SyncableSpecInput & {
  paginationStrategy: PaginationStrategy;
  pageNumberParamInQuery?: string;
  offsetParamInQuery?: string;
  pageTokenParamInQuery?: string;
  itemsPathInResponse?: string[];
  nextPageTokenPathInResponse?: string[];
  forcePageSizeParamInQuery?: string;
};
type JsonPath = string;
type HeaderSpec = string;
type ParameterName = string;

type InputPattern = {
  parameter?: ParameterName;
  requestBody?: JsonPath;
};
type OutputPattern = {
  responseBody?: JsonPath;
  responseHeader?: HeaderSpec;
};
type PaginationPattern = InputPattern & OutputPattern;

export type PaginationScheme = {
  paginate: string;

  pageNumber?: PaginationPattern;
  offset?: PaginationPattern;
  lastItemId?: PaginationPattern;
  token?: PaginationPattern;
  nextPageLink?: OutputPattern;

  pageSize?: PaginationPattern;
  totalCount?: OutputPattern;
  pageCount?: OutputPattern;

  firstPageLink?: OutputPattern;
  previousPageLink?: OutputPattern;
  currentPageLink?: OutputPattern;
  lastPageLink?: OutputPattern;

  hasNext?: OutputPattern;
  hasPrevious?: OutputPattern;
};

function determineStrategy(paginationScheme: PaginationScheme): PaginationStrategy {
  // | 'pageNumber'
  // | 'offset'
  // | 'pageToken'
  // | 'dateRange'
  // | 'rangeHeader'
  // | 'confirmationBased'
  // | 'linkHeader'
  // | 'none';
  if (paginationScheme.nextPageLink?.responseHeader) {
    return 'linkHeader';
  }
  if (paginationScheme.pageNumber?.parameter) {
    return 'pageNumber';
  }
  if (paginationScheme.offset?.parameter) {
    return 'offset';
  }
  if (paginationScheme.token?.parameter) {
    return 'pageToken';
  }
  return 'none';
}
export function normaliseSyncableSpec(
  input: SyncableSpecInput,
  paginationScheme: PaginationScheme,
  doc: OpenAPIV3_1.Document,
): SyncableSpec {
  const spec: SyncableSpec = {
    type: input.type || 'collection',
    name: input.name,
    paginationStrategy: determineStrategy(paginationScheme),
    query: input.query || {},
    itemsPathInResponse: paginationScheme.paginate.split('.'),
    defaultPageSize: input.defaultPageSize,
    forcePageSize: input.forcePageSize,
    forcePageSizeParamInQuery: paginationScheme.pageSize?.parameter,
    idField: input.idField || 'id',
    params: input.params || {},
  };
  // console.log('baseUrl:', this.baseUrl, 'schema.servers:', schema.servers);
  if (spec.paginationStrategy === 'pageNumber') {
    // console.log('setting pageNumberParamInQuery');
    spec.pageNumberParamInQuery = paginationScheme.pageNumber?.parameter || 'page';
  } else if (spec.paginationStrategy === 'offset') {
    spec.offsetParamInQuery = paginationScheme.offset.parameter || 'offset';
  } else if (spec.paginationStrategy === 'pageToken') {
    spec.pageTokenParamInQuery =
      paginationScheme.token.parameter || 'pageToken';
    spec.nextPageTokenPathInResponse =
      paginationScheme.token.responseBody.split('.') || ['nextPageToken'];
  } else if (spec.paginationStrategy === 'dateRange') {
    spec.startDateParamInQuery =
      input.startDateParamInQuery || 'startDate';
    spec.endDateParamInQuery = input.endDateParamInQuery || 'endDate';
    spec.startDate = input.startDate || '20000101000000';
    spec.endDate = input.endDate || '99990101000000';
  } else if (spec.paginationStrategy === 'confirmationBased') {
    // console.log('setting confirmOperation', syncable.confirmOperation);
    const confirmOperationSpec = input.confirmOperation as {
      path: string;
      method: string;
    };
    const confirmConfig =
      doc.paths[confirmOperationSpec.path][confirmOperationSpec.method]
        ?.responses['200']?.content?.['application/json']?.confirmOperation;
    // console.log(confirmConfig);
    spec.confirmOperation = {
      pathTemplate: confirmConfig.pathTemplate,
      method: confirmOperationSpec.method,
      path: confirmOperationSpec.path,
    };
    // console.log('determined confirmOperation config', config.confirmOperation);
    // throw new Error('debug');
  }
  // console.log('normalized', spec);
  return spec;
}
