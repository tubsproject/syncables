import { EventEmitter } from 'events';
import { parse } from 'yaml';

export type SyncableConfig = {
  name: string,
  pagingStrategy: 'pageNumber' | 'offset' | 'pageToken' | 'dateRange';
  listUrl?: string;
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
  constructor(specStr: string, syncableName: string, fetchFunction: typeof fetch = fetch) {
    super();
    this.parseSpec(specStr, syncableName);
    this.fetchFunction = fetchFunction;
  }
  parseSpec(specStr: string, syncableName: string): void {
    const spec = parse(specStr);
    Object.keys(spec.paths).forEach((path) => {
      const pathItem = spec.paths[path];
      if (pathItem.get && pathItem.get.responses['200']) {
        const response =
          pathItem.get.responses['200'].content['application/json'];
        if ((response.syncable) && (response.syncable.name === syncableName)) {
          this.config = {
            name: response.syncable.name,
            pagingStrategy: response.syncable.pagingStrategy,
            listUrl: path,
            query: response.syncable.query || {},
          };
          if (response.syncable.pagingStrategy === 'pageNumber') {
            this.config.pageNumberParamInQuery =
              response.syncable.pageNumberParamInQuery || 'page';
          } else if (response.syncable.pagingStrategy === 'offset') {
            this.config.offsetParamInQuery =
              response.syncable.offsetParamInQuery || 'offset';
          } else if (response.syncable.pagingStrategy === 'pageToken') {
            this.config.pageTokenParamInQuery =
              response.syncable.pageTokenParamInQuery || 'pageToken';
            this.config.pageTokenParamInResponse =
              response.syncable.pageTokenParamInResponse || 'pageToken';
          }
        }
      }
    });
  }

  private async pageNumberFetch(): Promise<T[]> {
    let allData: T[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = new URL(this.config.listUrl as string);
      Object.entries(this.config.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      url.searchParams.append(
        this.config.pageNumberParamInQuery,
        page.toString(),
      );
      const response = await this.fetchFunction(url.toString());
      const data = await response.json();
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
      const url = new URL(this.config.listUrl as string);
      Object.entries(this.config.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      url.searchParams.append(this.config.offsetParamInQuery, offset.toString());
      const response = await this.fetchFunction(url.toString());
      const data = await response.json();
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
      const url = new URL(this.config.listUrl as string);
      Object.entries(this.config.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      if (nextPageToken) {
        url.searchParams.append(this.config.pageTokenParamInQuery, nextPageToken);
      }
      const response = await this.fetchFunction(url.toString());
      const data = await response.json();
      allData = allData.concat(data.items);
      nextPageToken = data.nextPageToken || null;
    } while (nextPageToken);

    return allData;
  }
  private async dateRangeFetch(): Promise<T[]> {
    let allData: T[] = [];
    let startDate: string | null = this.config.startDate || null;
    const endDate: string | null = this.config.endDate || null;

    while (true) {
      const url = new URL(this.config.listUrl as string);
      Object.entries(this.config.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      if (startDate) {
        url.searchParams.append('startDate', startDate);
      }
      if (endDate) {
        url.searchParams.append('endDate', endDate);
      }
      const response = await this.fetchFunction(url.toString());
      const data = await response.json();
      allData = allData.concat(data.items);
      if (data.items.length === 0 || !data.hasMore) {
        break;
      }
      // Assuming items are sorted by date ascending
      startDate = data.items[data.items.length - 1].date;
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
