import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import { findPathParts } from './utils.js';

type PaginationStrategy =
  | 'pageNumber'
  | 'offset'
  | 'pageToken'
  | 'rangeHeader'
  | 'confirmationBased'
  | 'linkHeader'
  | 'none';
export type SyncableSpecInput = {
  type: string;
  name: string;
  query?: { [key: string]: string };
  defaultPageSize?: number;
  idField?: string;
  confirmOperation?: {
    pathTemplate: string;
    method: string;
    path: string;
  };
  parameters?: { [key: string]: string };
  itemsPathInResponse?: string[];
};
export type SyncableSpec = SyncableSpecInput & {
  paginationStrategy: PaginationStrategy;
  pageNumberParamInQuery?: string;
  offsetParamInQuery?: string;
  pageTokenParamInQuery?: string;
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

function determineStrategy(
  paginationScheme: PaginationScheme,
): PaginationStrategy {
  // | 'pageNumber'
  // | 'offset'
  // | 'pageToken'
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

function parsePaginationScheme(
  path: string,
  method: string,
  paginationSchemeName: string,
  doc: OpenAPIV3_1.Document,
): SyncableSpecInput {
  const paginationScheme = (
    doc.components as {
      paginationSchemes?: { [key: string]: PaginationScheme };
    }
  )?.paginationSchemes?.[paginationSchemeName];
  if (!paginationScheme) {
    throw new Error(
      `pagination scheme ${paginationSchemeName} not found in spec`,
    );
  }
  const input: SyncableSpecInput = {
    type: 'collection',
    name: path,
  };
  if (paginationScheme.pageSize?.parameter) {
    const paramObject =
      doc.paths[path]?.[method]?.parameters?.[
        paginationScheme.pageSize.parameter
      ];
    if (paramObject?.schema?.type === 'integer') {
      input.defaultPageSize = paramObject.schema.default as number;
    }
  }
  const itemsPathInResponse = paginationScheme.paginate.split('.');
  console.log('determined itemsPathInResponse', itemsPathInResponse);
  return Object.assign(
    {
      itemsPathInResponse,
    },
    input,
  );
}

export function generateSyncableSpec(
  path: string,
  doc: OpenAPIV3_1.Document,
): SyncableSpec {
  const paginationScheme = (
    doc.components as { paginationSchemes?: { default: PaginationScheme } }
  )?.paginationSchemes?.default;
  if (!paginationScheme) {
    throw new Error('No pagination scheme defined in spec');
  }
  const method = 'get';
  const paginationSchemeName = 'default';
  const responseSchema =
    doc.paths?.[path]?.[method]?.responses?.['200']?.content?.['application/json']?.schema;
  const input: SyncableSpecInput = parsePaginationScheme(
    path,
    method,
    paginationSchemeName,
    doc,
  );
  const spec: SyncableSpec = {
    type: 'collection',
    name: path,
    paginationStrategy: 'none',
    itemsPathInResponse: [],
    defaultPageSize: input.defaultPageSize,
    forcePageSizeParamInQuery: paginationScheme.pageSize?.parameter,
    idField: input.idField || 'id',
    parameters: {},
  };
  console.log('finding path parts', input.itemsPathInResponse, responseSchema);
  if (findPathParts(input.itemsPathInResponse, responseSchema)) {
    console.log('determining pagination strategy', paginationScheme);
    spec.paginationStrategy = determineStrategy(paginationScheme);
    spec.itemsPathInResponse = paginationScheme.paginate.split('.');
  } else {
    console.log('paginated items path not found in response schema, defaulting to no pagination strategy');
  }
  const parametersNames = Object.keys(doc.relations?.parameters || {});
  parametersNames.forEach((paramName) => {
    if (path.indexOf(`{${paramName}}`) !== -1) {
      console.log(`Adding parameter ${paramName} to spec for path ${path}`);
      spec.parameters[paramName] = doc.relations.parameters[paramName];
    }
  });
  // console.log('baseUrl:', this.baseUrl, 'schema.servers:', schema.servers);
  if (spec.paginationStrategy === 'pageNumber') {
    // console.log('setting pageNumberParamInQuery');
    spec.pageNumberParamInQuery =
      paginationScheme.pageNumber?.parameter || 'page';
  } else if (spec.paginationStrategy === 'offset') {
    spec.offsetParamInQuery = paginationScheme.offset?.parameter || 'offset';
  } else if (spec.paginationStrategy === 'pageToken') {
    spec.pageTokenParamInQuery =
      paginationScheme.token?.parameter || 'pageToken';
    spec.nextPageTokenPathInResponse =
      paginationScheme.token?.responseBody?.split('.') || ['nextPageToken'];
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
  console.log('normalized', spec);
  return spec;
}
