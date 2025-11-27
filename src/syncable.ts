import { EventEmitter } from 'events';
import { parse } from 'yaml';
import { default as urljoin } from 'url-join';

export type SyncableConfig = {
  name: string;
  pagingStrategy: 'pageNumber' | 'offset' | 'pageToken' | 'dateRange';
  baseUrl: string;
  urlPath: string;
  pageNumberParamInQuery?: string;
  offsetParamInQuery?: string;
  pageTokenParamInQuery?: string;
  pageTokenParamInResponse?: string;
  startDate?: string;
  endDate?: string;
  query?: { [key: string]: string };
};

export class Syncable<T> extends EventEmitter {
  fetchFunction: typeof fetch;
  config: SyncableConfig;
  authHeaders: { [key: string]: string } = {};
  constructor(
    specStr: string,
    syncableName: string,
    authHeaders: { [key: string]: string } = {},
    fetchFunction: typeof fetch = fetch,
  ) {
    super();
    this.config = this.parseSpec(specStr, syncableName);
    this.authHeaders = authHeaders;
    this.fetchFunction = fetchFunction;
  }
  parseSpec(specStr: string, syncableName: string): SyncableConfig {
    const spec = parse(specStr);
    for (const path of Object.keys(spec.paths)) {
      const pathItem = spec.paths[path];
      if (pathItem.get && pathItem.get.responses['200']) {
        const response =
          pathItem.get.responses['200'].content['application/json'];
        if (response.syncable && response.syncable.name === syncableName) {
          const config: SyncableConfig = {
            baseUrl:
              spec.servers && spec.servers.length > 0
                ? spec.servers[0].url
                : '',
            name: response.syncable.name,
            pagingStrategy: response.syncable.pagingStrategy,
            urlPath: path,
            query: response.syncable.query || {},
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
          }
          return config;
        }
      }
    }
    throw new Error(`Syncable with name "${syncableName}" not found in spec`);
  }

  private async doFetch(
    url: string,
  ): Promise<{ items: T[]; hasMore?: boolean; nextPageToken?: string }> {
    const response = await this.fetchFunction(url, {
      headers: this.authHeaders,
    });
    if (!response.ok) {
      throw new Error(
        `Fetch error: ${response.status} ${response.statusText} for URL ${url} (${await response.text()})`,
      );
    }
    return response.json();
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
      const data = await this.doFetch(url.toString());
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
      const data = await this.doFetch(url.toString());
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
      if (nextPageToken) {
        url.searchParams.append(
          this.config.pageTokenParamInQuery,
          nextPageToken,
        );
      }
      const data = await this.doFetch(url.toString());
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

  async fullFetch(): Promise<T[]> {
    switch (this.config['pagingStrategy']) {
      case 'pageNumber':
        return this.pageNumberFetch();
      case 'offset':
        return this.offsetFetch();
      case 'pageToken':
        return this.pageTokenFetch();
      case 'dateRange':
        return this.dateRangeFetch();
      default:
        throw new Error(
          `Unknown paging strategy: ${this.config['pagingStrategy']}`,
        );
    }
  }
}
