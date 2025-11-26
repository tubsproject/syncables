import { EventEmitter } from 'events';

export class Syncable<T> extends EventEmitter {
  fetchFunction: typeof fetch;
  spec: { [key: string]: string };
  constructor(
    spec: { [key: string]: string },
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
            pageNumberParam: response.syncable.pageNumberParam,
            listUrl: path,
          };
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
      url.searchParams.append('page', page.toString());
      const response = await this.fetchFunction(url.toString());
      const data = await response.json();
      allData = allData.concat(data.items);
      hasMore = data.hasMore;
      page += 1;
    }

    return allData;
  }

  private async pageTokenFetch(): Promise<T[]> {
    let allData: T[] = [];
    let nextPageToken: string | null = null;

    do {
      const url = new URL(this.spec.listUrl as string);
      if (nextPageToken) {
        url.searchParams.append('pageToken', nextPageToken);
      }
      const response = await this.fetchFunction(url.toString());
      const data = await response.json();
      allData = allData.concat(data.items);
      nextPageToken = data.nextPageToken || null;
    } while (nextPageToken);

    return allData;
  }

  async fullFetch(): Promise<T[]> {
    switch (this.spec['pagingStrategy']) {
      case 'pageNumber':
        return this.pageNumberFetch();
      case 'pageToken':
        return this.pageTokenFetch();
      default:
        throw new Error(
          `Unknown paging strategy: ${this.spec['pagingStrategy']}`,
        );
    }
  }
}
