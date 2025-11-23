import { EventEmitter } from 'events';

export class Syncable extends EventEmitter {
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

  private async pageNumberFetch() {
    let allData: any[] = [];
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

  private async pageTokenFetch() {
    let allData: any[] = [];
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

  async fullFetch() {
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
