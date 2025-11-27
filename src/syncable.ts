import { EventEmitter } from 'events';
type Spec = {
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
  spec: Spec;
  constructor(
    spec: Spec,
    fetchFunction: typeof fetch = fetch,
  ) {
    super();
    this.spec = spec;
    this.fetchFunction = fetchFunction;
  }
  parseSpec(spec: { paths: object; components: object }): void {
    Object.keys(spec.paths).forEach((path) => {
      const pathItem = spec.paths[path];
      if (pathItem.get && pathItem.get.responses['200']) {
        const response =
          pathItem.get.responses['200'].content['application/json'];
        if (response.syncable) {
          this.spec = {
            pagingStrategy: response.syncable.pagingStrategy,
            listUrl: path,
          };
          if (response.syncable.pagingStrategy === 'pageNumber') {
            this.spec.pageNumberParamInQuery =
              response.syncable.pageNumberParamInQuery || 'page';
          } else if (response.syncable.pagingStrategy === 'offset') {
            this.spec.offsetParamInQuery =
              response.syncable.offsetParamInQuery || 'offset';
          } else if (response.syncable.pagingStrategy === 'pageToken') {
            this.spec.pageTokenParamInQuery =
              response.syncable.pageTokenParamInQuery || 'pageToken';
            this.spec.pageTokenParamInResponse =
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
      const url = new URL(this.spec.listUrl as string);
      Object.entries(this.spec.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      url.searchParams.append(this.spec.pageNumberParamInQuery, page.toString());
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
      const url = new URL(this.spec.listUrl as string);
      Object.entries(this.spec.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      url.searchParams.append(this.spec.offsetParamInQuery, offset.toString());
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
      const url = new URL(this.spec.listUrl as string);
      Object.entries(this.spec.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      if (nextPageToken) {
        url.searchParams.append(this.spec.pageTokenParamInQuery, nextPageToken);
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
    let startDate: string | null = this.spec.startDate || null;
    const endDate: string | null = this.spec.endDate || null;

    while (true) {
      const url = new URL(this.spec.listUrl as string);
      Object.entries(this.spec.query || {}).forEach(([key, value]) => {
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
    switch (this.spec['pagingStrategy']) {
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
          `Unknown paging strategy: ${this.spec['pagingStrategy']}`,
        );
    }
  }
}
