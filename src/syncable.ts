import { EventEmitter } from 'events';
import { default as urljoin } from 'url-join';
import { default as createDebug } from 'debug';
import { Client, getFields, createSqlTable, insertData } from './db.js';
import { dereference } from '@readme/openapi-parser';
import { parse } from 'yaml';
import { getObjectPath } from '../__tests__/integration/mock-server/apply-pagination.js';

const debug = createDebug('syncable');

export type SyncableConfig = {
  name: string;
  pagingStrategy:
    | 'pageNumber'
    | 'offset'
    | 'pageToken'
    | 'dateRange'
    | 'rangeHeader'
    | 'confirmationBased';
  baseUrl: string;
  urlPath: string;
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
  confirmOperation?: {
    pathTemplate: string;
    idField: string;
    method: string;
    path: string;
  };
};

export class Syncable<T> extends EventEmitter {
  fetchFunction: typeof fetch;
  config: SyncableConfig;
  specStr: string;
  specFilename: string;
  syncableName: string;
  spec: { paths: object; servers: { url: string }[] };
  authHeaders: { [key: string]: string } = {};
  client: Client | null = null;
  constructor({
    specStr,
    specFilename,
    syncableName,
    authHeaders = {},
    fetchFunction = fetch,
    dbConn,
  }: {
    specStr: string;
    specFilename: string;
    syncableName: string;
    authHeaders?: { [key: string]: string };
    fetchFunction?: typeof fetch;
    dbConn?: string;
  }) {
    super();
    this.specStr = specStr;
    this.specFilename = specFilename;
    this.syncableName = syncableName;
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
    if (this.specFilename.endsWith('.json')) {
      specObj = JSON.parse(this.specStr);
    } else {
      specObj = parse(this.specStr);
    }
    const schema = await dereference(specObj);
    let solution: object | null = null;
    for (const path of Object.keys(schema.paths)) {
      const pathItem = schema.paths[path];
      if (pathItem.get && pathItem.get.responses['200']) {
        // console.log('Checking 200 response content', path, typeof (pathItem.get.responses['200'] as any).content);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (
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
            if (
              response.syncable &&
              response.syncable.name === this.syncableName
            ) {
              const config: SyncableConfig = {
                baseUrl:
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (schema as any).servers && (schema as any).servers.length > 0
                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (schema as any).servers[0].url
                    : '',
                urlPath: path,
                name: response.syncable.name,
                pagingStrategy: response.syncable.pagingStrategy,
                query: response.syncable.query || {},
                itemsPathInResponse:
                  response.syncable.itemsPathInResponse || [],
                defaultPageSize: response.syncable.defaultPageSize,
                forcePageSize: response.syncable.forcePageSize,
                forcePageSizeParamInQuery:
                  response.syncable.forcePageSizeParamInQuery,
              };
              // console.log('baseUrl:', config.baseUrl, (schema as any).servers);
              if (response.syncable.pagingStrategy === 'pageNumber') {
                config.pageNumberParamInQuery =
                  response.syncable.pageNumberParamInQuery || 'page';
              } else if (response.syncable.pagingStrategy === 'offset') {
                config.offsetParamInQuery =
                  response.syncable.offsetParamInQuery || 'offset';
              } else if (response.syncable.pagingStrategy === 'pageToken') {
                config.pageTokenParamInQuery =
                  response.syncable.pageTokenParamInQuery || 'pageToken';
                config.nextPageTokenPathInResponse = response.syncable
                  .nextPageTokenPathInResponse || ['nextPageToken'];
              } else if (response.syncable.pagingStrategy === 'dateRange') {
                config.startDateParamInQuery =
                  response.syncable.startDateParamInQuery || 'startDate';
                config.endDateParamInQuery =
                  response.syncable.endDateParamInQuery || 'endDate';
                config.startDate =
                  response.syncable.startDate || '20000101000000';
                config.endDate = response.syncable.endDate || '99990101000000';
              } else if (
                response.syncable.pagingStrategy === 'confirmationBased'
              ) {
                // console.log('setting confirmOperation', response.syncable.confirmOperation);
                config.confirmOperation = response.syncable.confirmOperation;
              }
              this.config = config;
              // console.log('Found syncable config:', this.config, response.syncable);
              solution = schema;
            }
          },
        );
      }
    }
    if (solution) {
      return solution;
    }
    throw new Error(
      `Syncable with name "${this.syncableName}" not found in spec`,
    );
  }

  private async doFetch(
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
    // console.log('responseData nextPageToken', Object.keys(responseData), this.config.pageTokenParamInQuery, responseData[this.config.pageTokenParamInQuery]);
    let items = responseData;
    for (let i = 0; i < this.config.itemsPathInResponse.length; i++) {
      const pathPart = this.config.itemsPathInResponse[i];
      if (typeof items !== 'object' || items === null || !(pathPart in items)) {
        throw new Error(
          `Invalid itemsPathInResponse: could not find path part "${pathPart}" in response ${url}`,
        );
      }
      items = items[pathPart];
    }
    // console.log('parsed responseData', responseData, items, this.config.itemsPathInResponse);
    let nextPageToken: string | undefined = undefined;
    try {
      nextPageToken = getObjectPath(
        responseData,
        this.config.nextPageTokenPathInResponse || ['nextPageToken'],
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
  private async pageNumberFetch(): Promise<T[]> {
    let allData: T[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = this.getUrl();
      Object.entries(this.config.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      url.searchParams.append(
        this.config.pageNumberParamInQuery,
        page.toString(),
      );
      if (this.config.forcePageSize) {
        const param = this.config.forcePageSizeParamInQuery || 'pageSize';
        url.searchParams.append(param, this.config.forcePageSize.toString());
      }

      const data = await this.doFetch(
        url.toString(),
        {},
        this.config.forcePageSize || this.config.defaultPageSize || 1,
      );
      allData = allData.concat(data.items);
      hasMore = data.hasMore;
      page += 1;
    }

    return allData;
  }

  private async offsetFetch(): Promise<T[]> {
    let allData: T[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const url = this.getUrl();
      Object.entries(this.config.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      url.searchParams.append(
        this.config.offsetParamInQuery,
        offset.toString(),
      );
      if (this.config.forcePageSize) {
        const param = this.config.forcePageSizeParamInQuery || 'pageSize';
        url.searchParams.append(param, this.config.forcePageSize.toString());
      }

      const data = await this.doFetch(
        url.toString(),
        {},
        this.config.forcePageSize || this.config.defaultPageSize || 1,
      );
      allData = allData.concat(data.items);
      hasMore = data.hasMore;
      offset += data.items.length;
    }

    return allData;
  }

  private async pageTokenFetch(): Promise<T[]> {
    let allData: T[] = [];
    let nextPageToken: string | null = null;

    do {
      const url = this.getUrl();
      Object.entries(this.config.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      if (this.config.forcePageSize) {
        const param = this.config.forcePageSizeParamInQuery || 'pageSize';
        url.searchParams.append(param, this.config.forcePageSize.toString());
      }
      if (nextPageToken) {
        url.searchParams.append(
          this.config.pageTokenParamInQuery,
          nextPageToken,
        );
      }
      const data = await this.doFetch(
        url.toString(),
        {},
        this.config.forcePageSize || this.config.defaultPageSize || 1,
      );
      // console.log('fetched', data);
      allData = allData.concat(data.items);
      nextPageToken = data.nextPageToken || null;
    } while (nextPageToken);

    return allData;
  }
  private getUrl(): URL {
    const joined = urljoin(this.config.baseUrl, this.config.urlPath);
    return new URL(joined);
  }
  private async dateRangeFetch(): Promise<T[]> {
    let allData: T[] = [];
    let startDate: number = parseInt(this.config.startDate, 10);
    let endDate: number = parseInt(this.config.endDate, 10);
    if (isNaN(startDate)) {
      startDate = 20000101000000;
    }
    if (isNaN(endDate)) {
      endDate = 99990101000000;
    }
    let cursor = startDate;
    const increment: number = /* this.config.increment || */ 10000000000; // yearly increments
    while (cursor <= endDate) {
      const url = this.getUrl();
      Object.entries(this.config.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      if (startDate) {
        url.searchParams.append('startDate', cursor.toString());
      }
      if (endDate) {
        url.searchParams.append('endDate', (cursor + increment - 1).toString());
      }
      // console.log('date range fetching', url.toString());
      const data = await this.doFetch(url.toString());
      allData = allData.concat(data.items);
      cursor += increment;
    }

    return allData;
  }

  private async rangeHeaderFetch(): Promise<T[]> {
    let allData: T[] = [];
    const numItemsPerPage = this.config.forcePageSize || 20;
    let rangeHeader = `id ..; max=${numItemsPerPage}`;

    while (true) {
      const url = this.getUrl();
      Object.entries(this.config.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      const data = await this.doFetch(
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

  private async confirmationBasedFetch(): Promise<T[]> {
    let allData: T[] = [];
    let thisBatch: { items: T[]; hasMore?: boolean; nextPageToken?: string };
    do {
      thisBatch = await this.doFetch(this.getUrl().toString());
      // console.log('fetched batch', thisBatch.items.length, thisBatch);
      allData = allData.concat(thisBatch.items);
      const promises = Promise.all(
        thisBatch.items.map(async (item) => {
          const itemId = item[this.config.confirmOperation.idField].toString();
          // console.log('parsed out item id', item, itemId)
          const confirmationUrl = urljoin(
            this.config.baseUrl,
            this.config.confirmOperation.pathTemplate.replace('{id}', itemId),
          );
          // console.log('confirming', confirmationUrl);
          await this.fetchFunction(confirmationUrl, {
            method: this.config.confirmOperation.method,
            headers: Object.assign({}, this.authHeaders),
          });
        }),
      );
      await promises;
    } while (thisBatch.hasMore);
    return allData;
  }
  private async doFullFetch(): Promise<T[]> {
    switch (this.config['pagingStrategy']) {
      case 'pageNumber':
        return this.pageNumberFetch();
      case 'offset':
        return this.offsetFetch();
      case 'pageToken':
        return this.pageTokenFetch();
      case 'dateRange':
        return this.dateRangeFetch();
      case 'rangeHeader':
        return this.rangeHeaderFetch();
      case 'confirmationBased':
        return this.confirmationBasedFetch();
      default:
        throw new Error(
          `Unknown paging strategy: ${this.config['pagingStrategy']}`,
        );
    }
  }

  async fullFetch(): Promise<T[]> {
    const schema = await this.parseSpec();

    const data = await this.doFullFetch();
    if (this.client) {
      await this.client.connect();
      const fields = getFields(
        schema,
        this.config.urlPath,
        this.config.itemsPathInResponse.join('.'),
      );
      await createSqlTable(this.client, this.config.name, fields);
      await insertData(
        this.client,
        this.config.name,
        data,
        Object.keys(fields).filter(
          (f) => ['string'].indexOf(fields[f].type) !== -1,
        ),
      );
      await this.client.end();
    }
    return data;
  }
}
