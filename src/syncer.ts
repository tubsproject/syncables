import { EventEmitter } from 'events';
import { default as urljoin } from 'url-join';
import { default as createDebug } from 'debug';
import { Client, getFields, createSqlTable, insertData } from './db.js';
import { dereference } from '@readme/openapi-parser';
import { parse } from 'yaml';
import { getObjectPath } from '../__tests__/integration/mock-server/apply-pagination.js';

const debug = createDebug('syncable');

export type SyncableSpec = {
  name: string;
  paginationStrategy:
    | 'pageNumber'
    | 'offset'
    | 'pageToken'
    | 'dateRange'
    | 'rangeHeader'
    | 'confirmationBased';
  pageNumberParamInQuery?: string;
  offsetParamInQuery?: string;
  pageTokenParamInQuery?: string;
  startDateParamInQuery?: string;
  endDateParamInQuery?: string;
  startDate?: string;
  endDate?: string;
  query?: { [key: string]: string };
  itemsPathInResponse?: string[];
  nextPageTokenPathInResponse?: string[];
  defaultPageSize?: number;
  forcePageSize?: number;
  forcePageSizeParamInQuery?: string;
  idField?: string;
  confirmOperation?: {
    pathTemplate: string;
    method: string;
    path: string;
  };
  params?: { [key: string]: string };
};

export class Syncer<T> extends EventEmitter {
  fetchFunction: typeof fetch;
  syncables: {
    [syncableName: string]: {
      path: string;
      spec: SyncableSpec;
    };
  } = {};
  specStr: string;
  baseUrl: string;
  authHeaders: { [key: string]: string } = {};
  client: Client | null = null;
  constructor({
    specStr,
    authHeaders = {},
    fetchFunction = fetch,
    dbConn,
  }: {
    specStr: string;
    authHeaders?: { [key: string]: string };
    fetchFunction?: typeof fetch;
    dbConn?: string;
  }) {
    super();
    this.specStr = specStr;
    this.authHeaders = authHeaders;
    this.fetchFunction = fetchFunction;
    if (dbConn) {
      this.client = new Client({
        connectionString: dbConn,
        ssl: {
          rejectUnauthorized: process.env.NODE_ENV === 'production',
        },
      });
    }
  }

  async parseSpec(): Promise<object> {
    let specObj;
    try {
      specObj = parse(this.specStr);
    } catch (err1) {
      try {
        specObj = JSON.parse(this.specStr);
      } catch (err2) {
        throw new Error(
          `Spec is not valid JSON or YAML: ${err1.message} / ${err2.message}`,
        );
      }
    }
    const schema = await dereference(specObj);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.baseUrl =
      (schema as any).servers && (schema as any).servers.length > 0
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (schema as any).servers[0].url
        : '';
    let solution: object | null = null;
    for (const path of Object.keys(schema.paths)) {
      const pathItem = schema.paths[path];
      if (pathItem.get && pathItem.get.responses['200']) {
        // console.log('Checking 200 response content', path, typeof (pathItem.get.responses['200'] as any).content);
        if (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          typeof (pathItem.get.responses['200'] as any).content !== 'object'
        ) {
          continue;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.keys((pathItem.get.responses['200'] as any).content).forEach(
          (contentType) => {
            // console.log('Checking path', path, contentType);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = (pathItem.get.responses['200'] as any).content[
              contentType
            ];
            if (response.syncable) {
              const spec: SyncableSpec = {
                name: response.syncable.name,
                paginationStrategy: response.syncable.paginationStrategy,
                query: response.syncable.query || {},
                itemsPathInResponse:
                  response.syncable.itemsPathInResponse || [],
                defaultPageSize: response.syncable.defaultPageSize,
                forcePageSize: response.syncable.forcePageSize,
                forcePageSizeParamInQuery:
                  response.syncable.forcePageSizeParamInQuery,
                idField: response.syncable.idField || 'id',
              };
              // console.log('baseUrl:', config.baseUrl, (schema as any).servers);
              if (response.syncable.paginationStrategy === 'pageNumber') {
                spec.pageNumberParamInQuery =
                  response.syncable.pageNumberParamInQuery || 'page';
              } else if (response.syncable.paginationStrategy === 'offset') {
                spec.offsetParamInQuery =
                  response.syncable.offsetParamInQuery || 'offset';
              } else if (response.syncable.paginationStrategy === 'pageToken') {
                spec.pageTokenParamInQuery =
                  response.syncable.pageTokenParamInQuery || 'pageToken';
                spec.nextPageTokenPathInResponse = response.syncable
                  .nextPageTokenPathInResponse || ['nextPageToken'];
              } else if (response.syncable.paginationStrategy === 'dateRange') {
                spec.startDateParamInQuery =
                  response.syncable.startDateParamInQuery || 'startDate';
                spec.endDateParamInQuery =
                  response.syncable.endDateParamInQuery || 'endDate';
                spec.startDate =
                  response.syncable.startDate || '20000101000000';
                spec.endDate = response.syncable.endDate || '99990101000000';
              } else if (
                response.syncable.paginationStrategy === 'confirmationBased'
              ) {
                // console.log('setting confirmOperation', response.syncable.confirmOperation);
                const confirmOperationSpec = response.syncable
                  .confirmOperation as { path: string; method: string };
                const confirmConfig =
                  specObj.paths[confirmOperationSpec.path][
                    confirmOperationSpec.method
                  ]?.responses['200']?.content?.['application/json']
                    ?.confirmOperation;
                // console.log(confirmConfig);
                spec.confirmOperation = {
                  pathTemplate: confirmConfig.pathTemplate,
                  method: confirmOperationSpec.method,
                  path: confirmOperationSpec.path,
                };
                // console.log('determined confirmOperation config', config.confirmOperation);
                // throw new Error('debug');
              }
              this.syncables[response.syncable.name] = {
                path: path,
                spec: spec,
              };
              solution = schema;
            }
          },
        );
      }
    }
    if (solution) {
      return solution;
    }
    throw new Error(`No syncables found in spec`);
  }

  private async doFetch(
    spec: SyncableSpec,
    url: string,
    headers: { [key: string]: string } = {},
    minNumItemsToExpect: number = 1,
  ): Promise<{ items: T[]; hasMore?: boolean; nextPageToken?: string }> {
    debug('Fetching', url, headers);
    const response = await this.fetchFunction(url, {
      headers: Object.assign({}, this.authHeaders, headers),
    });
    if (!response.ok) {
      throw new Error(
        `Fetch error: ${response.status} ${response.statusText} for URL ${url} (${await response.text()})`,
      );
    }

    const responseData = await response.json();
    // console.log('responseData nextPageToken', Object.keys(responseData), spec.pageTokenParamInQuery, responseData[spec.pageTokenParamInQuery]);
    let items = responseData;
    for (let i = 0; i < spec.itemsPathInResponse.length; i++) {
      const pathPart = spec.itemsPathInResponse[i];
      if (typeof items !== 'object' || items === null || !(pathPart in items)) {
        throw new Error(
          `Invalid itemsPathInResponse: could not find path part "${pathPart}" in response ${url}`,
        );
      }
      items = items[pathPart];
    }
    // console.log('parsed responseData', responseData, items, spec.itemsPathInResponse);
    let nextPageToken: string | undefined = undefined;
    try {
      nextPageToken = getObjectPath(
        responseData,
        spec.nextPageTokenPathInResponse || ['nextPageToken'],
      );
    } catch (err) {
      // ignore
      void err;
    }
    return {
      items,
      hasMore: items.length >= minNumItemsToExpect,
      nextPageToken,
    };
  }
  private async pageNumberFetch(
    syncableName: string,
    parents: {
      [parentName: string]: string[];
    },
  ): Promise<T[]> {
    let allData: T[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = this.getUrl(this.syncables[syncableName].path, parents);
      const spec = this.syncables[syncableName].spec;
      Object.entries(spec.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      url.searchParams.append(spec.pageNumberParamInQuery, page.toString());
      if (spec.forcePageSize) {
        const param = spec.forcePageSizeParamInQuery || 'pageSize';
        url.searchParams.append(param, spec.forcePageSize.toString());
      }

      const data = await this.doFetch(
        spec,
        url.toString(),
        {},
        spec.forcePageSize || spec.defaultPageSize || 1,
      );
      allData = allData.concat(data.items);
      hasMore = data.hasMore;
      page += 1;
    }

    return allData;
  }

  private async offsetFetch(
    syncableName: string,
    parents: {
      [parentName: string]: string[];
    },
  ): Promise<T[]> {
    let allData: T[] = [];
    let offset = 0;
    let hasMore = true;
    const spec = this.syncables[syncableName].spec;

    while (hasMore) {
      const url = this.getUrl(this.syncables[syncableName].path, parents);
      Object.entries(spec.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      url.searchParams.append(spec.offsetParamInQuery, offset.toString());
      if (spec.forcePageSize) {
        const param = spec.forcePageSizeParamInQuery || 'pageSize';
        url.searchParams.append(param, spec.forcePageSize.toString());
      }

      const data = await this.doFetch(
        spec,
        url.toString(),
        {},
        spec.forcePageSize || spec.defaultPageSize || 1,
      );
      allData = allData.concat(data.items);
      hasMore = data.hasMore;
      offset += data.items.length;
    }

    return allData;
  }

  private async pageTokenFetch(
    syncableName: string,
    parents: {
      [parentName: string]: string[];
    },
  ): Promise<T[]> {
    let allData: T[] = [];
    let nextPageToken: string | null = null;
    const spec = this.syncables[syncableName].spec;
    do {
      const url = this.getUrl(this.syncables[syncableName].path, parents);
      Object.entries(spec.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      if (spec.forcePageSize) {
        const param = spec.forcePageSizeParamInQuery || 'pageSize';
        url.searchParams.append(param, spec.forcePageSize.toString());
      }
      if (nextPageToken) {
        url.searchParams.append(spec.pageTokenParamInQuery, nextPageToken);
      }
      const data = await this.doFetch(
        spec,
        url.toString(),
        {},
        spec.forcePageSize || spec.defaultPageSize || 1,
      );
      // console.log('fetched', data);
      allData = allData.concat(data.items);
      nextPageToken = data.nextPageToken || null;
    } while (nextPageToken);

    return allData;
  }
  private getUrl(
    urlPath: string,
    parents: { [parentName: string]: string[] },
  ): URL {
    const pattern = `{${Object.keys(parents)[0]}Id}`;

    if (Object.keys(parents).length > 0) {
      console.log(
        'Filling in pattern',
        urlPath,
        pattern,
        'with',
        parents[Object.keys(parents)[0]][0],
      );
      urlPath = urlPath.replace(pattern, parents[Object.keys(parents)[0]][0]);
    }
    const joined = urljoin(this.baseUrl, urlPath);
    return new URL(joined);
  }
  private async dateRangeFetch(
    syncableName: string,
    parents: {
      [parentName: string]: string[];
    },
  ): Promise<T[]> {
    const spec = this.syncables[syncableName].spec;
    let allData: T[] = [];
    let startDate: number = parseInt(spec.startDate, 10);
    let endDate: number = parseInt(spec.endDate, 10);
    if (isNaN(startDate)) {
      startDate = 20000101000000;
    }
    if (isNaN(endDate)) {
      endDate = 99990101000000;
    }
    let cursor = startDate;
    const increment: number = /* spec.increment || */ 10000000000; // yearly increments
    while (cursor <= endDate) {
      const url = this.getUrl(this.syncables[syncableName].path, parents);
      Object.entries(spec.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      if (startDate) {
        url.searchParams.append('startDate', cursor.toString());
      }
      if (endDate) {
        url.searchParams.append('endDate', (cursor + increment - 1).toString());
      }
      // console.log('date range fetching', url.toString());
      const data = await this.doFetch(spec, url.toString());
      allData = allData.concat(data.items);
      cursor += increment;
    }

    return allData;
  }

  private async rangeHeaderFetch(
    syncableName: string,
    parents: {
      [parentName: string]: string[];
    },
  ): Promise<T[]> {
    const spec = this.syncables[syncableName].spec;
    let allData: T[] = [];
    const numItemsPerPage = spec.forcePageSize || 20;
    let rangeHeader = `id ..; max=${numItemsPerPage}`;

    while (true) {
      const url = this.getUrl(this.syncables[syncableName].path, parents);
      Object.entries(spec.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      const data = await this.doFetch(
        spec,
        url.toString(),
        {
          Range: rangeHeader,
        },
        numItemsPerPage,
      );
      allData = allData.concat(data.items);
      const lastItemId =
        data.items.length > 0
          ? (data.items[data.items.length - 1] as unknown as { id: number }).id
          : null;
      rangeHeader = `id ]${lastItemId}..; max=${numItemsPerPage}`;

      if (data.items.length < numItemsPerPage || !data.hasMore) {
        break;
      }
    }

    return allData;
  }

  private async confirmationBasedFetch(
    syncableName: string,
    parents: {
      [parentName: string]: string[];
    },
  ): Promise<T[]> {
    const spec = this.syncables[syncableName].spec;
    let allData: T[] = [];
    let thisBatch: { items: T[]; hasMore?: boolean; nextPageToken?: string };
    do {
      thisBatch = await this.doFetch(
        spec,
        this.getUrl(this.syncables[syncableName].path, parents).toString(),
      );
      // console.log('fetched batch', thisBatch.items.length, thisBatch);
      // console.log('confirming', spec.confirmOperation);
      allData = allData.concat(thisBatch.items);
      const promises = Promise.all(
        thisBatch.items.map(async (item) => {
          const itemId = item[spec.idField].toString();
          // console.log('parsed out item id', item, itemId)
          const confirmationUrl = urljoin(
            this.baseUrl,
            spec.confirmOperation.pathTemplate.replace('{id}', itemId),
          );
          // console.log('confirming', confirmationUrl);
          await this.fetchFunction(confirmationUrl, {
            method: spec.confirmOperation.method,
            headers: Object.assign({}, this.authHeaders),
          });
        }),
      );
      await promises;
    } while (thisBatch.hasMore);
    return allData;
  }
  private async doFullFetch(
    syncableName: string,
    parents: {
      [parentName: string]: string[];
    },
  ): Promise<T[]> {
    const spec = this.syncables[syncableName].spec;
    switch (spec['paginationStrategy']) {
      case 'pageNumber':
        return this.pageNumberFetch(syncableName, parents);
      case 'offset':
        return this.offsetFetch(syncableName, parents);
      case 'pageToken':
        return this.pageTokenFetch(syncableName, parents);
      case 'dateRange':
        return this.dateRangeFetch(syncableName, parents);
      case 'rangeHeader':
        return this.rangeHeaderFetch(syncableName, parents);
      case 'confirmationBased':
        return this.confirmationBasedFetch(syncableName, parents);
      default:
        throw new Error(
          `Unknown paging strategy: ${spec['paginationStrategy']}`,
        );
    }
  }

  async fullFetch(
    parents: { [parentName: string]: string[] } = {},
  ): Promise<T[]> {
    const data: {
      [syncableName: string]: T[];
    } = {};
    const schema = await this.parseSpec();
    for (const specName of Object.keys(this.syncables)) {
      const syncable = this.syncables[specName];
      const data = await this.doFullFetch(specName, parents);
      if (this.client) {
        await this.client.connect();
        const fields = getFields(
          schema,
          syncable.path,
          syncable.spec.itemsPathInResponse.join('.'),
        );
        await createSqlTable(this.client, specName, fields);
        await insertData(
          this.client,
          specName,
          data,
          Object.keys(fields).filter(
            (f) => ['string'].indexOf(fields[f].type) !== -1,
          ),
        );
      }
      data[specName] = data;
      if (this.client) {
        await this.client.end();
      }
    }
    return data[Object.keys(this.syncables)[0]];
  }
}
