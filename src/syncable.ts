import { EventEmitter } from 'events';
import { parse } from 'yaml';
import { default as urljoin } from 'url-join';
import { default as createDebug } from 'debug';
import { Client, getFields, createSqlTable } from './db.js';

const debug = createDebug('syncable');

export type SyncableConfig = {
  name: string;
  pagingStrategy:
    | 'pageNumber'
    | 'offset'
    | 'pageToken'
    | 'dateRange'
    | 'rangeHeader';
  baseUrl: string;
  urlPath: string;
  pageNumberParamInQuery?: string;
  offsetParamInQuery?: string;
  pageTokenParamInQuery?: string;
  pageTokenParamInResponse?: string;
  startDateParamInQuery?: string;
  endDateParamInQuery?: string;
  startDate?: string;
  endDate?: string;
  query?: { [key: string]: string };
  itemsPathInResponse?: string[];
  defaultPageSize?: number;
  forcePageSize?: number;
  forcePageSizeParamInQuery?: string;
};

export class Syncable<T> extends EventEmitter {
  fetchFunction: typeof fetch;
  config: SyncableConfig;
  specStr: string;
  spec: any;
  authHeaders: { [key: string]: string } = {};
  client: Client | null = null;
  constructor({
    specStr,
    syncableName,
    authHeaders = {},
    fetchFunction = fetch,
    dbConn,
  }: {
    specStr: string;
    syncableName: string;
    authHeaders?: { [key: string]: string };
    fetchFunction?: typeof fetch;
    dbConn?: string;
  }) {
    super();
    this.config = this.parseSpec(specStr, syncableName);
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
  
  private parseSpec(specStr: string, syncableName: string): SyncableConfig {
    this.spec = parse(specStr);
    for (const path of Object.keys(this.spec.paths)) {
      const pathItem = this.spec.paths[path];
      if (pathItem.get && pathItem.get.responses['200']) {
        const response =
          pathItem.get.responses['200'].content['application/json'];
        if (response.syncable && response.syncable.name === syncableName) {
          const config: SyncableConfig = {
            baseUrl:
              this.spec.servers && this.spec.servers.length > 0
                ? this.spec.servers[0].url
                : '',
            urlPath: path,
            name: response.syncable.name,
            pagingStrategy: response.syncable.pagingStrategy,
            query: response.syncable.query || {},
            itemsPathInResponse: response.syncable.itemsPathInResponse || [],
            defaultPageSize: response.syncable.defaultPageSize,
            forcePageSize: response.syncable.forcePageSize,
            forcePageSizeParamInQuery:
              response.syncable.forcePageSizeParamInQuery,
          };
          if (response.syncable.pagingStrategy === 'pageNumber') {
            config.pageNumberParamInQuery =
              response.syncable.pageNumberParamInQuery || 'page';
          } else if (response.syncable.pagingStrategy === 'offset') {
            config.offsetParamInQuery =
              response.syncable.offsetParamInQuery || 'offset';
          } else if (response.syncable.pagingStrategy === 'pageToken') {
            config.pageTokenParamInQuery =
              response.syncable.pageTokenParamInQuery || 'pageToken';
            config.pageTokenParamInResponse =
              response.syncable.pageTokenParamInResponse || 'pageToken';
          } else if (response.syncable.pagingStrategy === 'dateRange') {
            config.startDateParamInQuery =
              response.syncable.startDateParamInQuery || 'startDate';
            config.endDateParamInQuery =
              response.syncable.endDateParamInQuery || 'endDate';
            config.startDate = response.syncable.startDate || '20000101000000';
            config.endDate = response.syncable.endDate || '99990101000000';
          }
          return config;
        }
      }
    }
    throw new Error(`Syncable with name "${syncableName}" not found in spec`);
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
    return {
      items,
      hasMore: items.length >= minNumItemsToExpect,
      nextPageToken: this.config.pageTokenParamInResponse
        ? responseData[this.config.pageTokenParamInResponse]
        : undefined,
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

      const data = await this.doFetch(url.toString(), {}, this.config.forcePageSize || this.config.defaultPageSize || 1);
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

      const data = await this.doFetch(url.toString(), {}, this.config.forcePageSize || this.config.defaultPageSize || 1);
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
      const data = await this.doFetch(url.toString(), {}, this.config.forcePageSize || this.config.defaultPageSize || 1);
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
    let startDate: string | null = this.config.startDate || null;
    const endDate: string | null = this.config.endDate || null;

    while (true) {
      const url = this.getUrl();
      Object.entries(this.config.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      if (startDate) {
        url.searchParams.append('startDate', startDate);
      }
      if (endDate) {
        url.searchParams.append('endDate', endDate);
      }
      const data = await this.doFetch(url.toString());
      allData = allData.concat(data.items);
      if (data.items.length === 0 || !data.hasMore) {
        break;
      }
      // Assuming items are sorted by date ascending
      startDate = (
        data.items[data.items.length - 1] as unknown as { date: string }
      ).date; // FIXME
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
      default:
        throw new Error(
          `Unknown paging strategy: ${this.config['pagingStrategy']}`,
        );
    }
  }

  async fullFetch(): Promise<T[]> {
    const data = await this.doFullFetch();
    if (this.client) {
      await this.client.connect();
      const fields = getFields(this.spec, this.config.urlPath, this.config.itemsPathInResponse.join('.'))
      await createSqlTable(this.client, this.config.name, fields);
      await this.client.insertData(this.config.name, data, fields);
      await this.client.end();
    }
    return data;
  }
}
