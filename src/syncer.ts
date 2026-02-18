import type { OpenAPIV3 } from '@scalar/openapi-types';
import { EventEmitter } from 'events';
import { default as urljoin } from 'url-join';
import { default as createDebug } from 'debug';
import { Client, getFields, createSqlTable, insertData } from './db.js';
import { dereference } from '@readme/openapi-parser';
import { parse } from 'yaml';
import { getObjectPath } from './utils.js';

const debug = createDebug('syncable');

export async function specStrToObj(
  specStr: string,
): Promise<OpenAPIV3.Document> {
  let specObj;
  try {
    specObj = parse(specStr);
  } catch (err1) {
    try {
      specObj = JSON.parse(specStr);
    } catch (err2) {
      throw new Error(
        `Spec is not valid JSON or YAML: ${err1.message} / ${err2.message}`,
      );
    }
  }
  return await dereference(specObj);
}

export type SyncableSpec = {
  type: string;
  name: string;
  paginationStrategy:
    | 'pageNumber'
    | 'offset'
    | 'pageToken'
    | 'dateRange'
    | 'rangeHeader'
    | 'confirmationBased'
    | 'none';
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

export class Syncer extends EventEmitter {
  fetchFunction: typeof fetch;
  syncables: {
    [syncableName: string]: {
      path: string;
      spec: SyncableSpec;
      schema: object;
    };
  } = {};
  specStr: string;
  baseUrl: string;
  authHeaders: { [key: string]: string } = {};
  client: Client | null = null;
  dbConn: string | null = null;
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
    this.dbConn = dbConn || null;
  }

  private async initDb(): Promise<void> {
    if (this.dbConn && !this.client) {
      this.client = new Client({
        connectionString: this.dbConn,
        ssl: {
          rejectUnauthorized: false,
        },
      });
      await this.client.connect();
    }
  }
  async parseSpec(): Promise<object> {
    const schema = await specStrToObj(this.specStr);

    this.baseUrl =
      schema.servers && schema.servers.length > 0 ? schema.servers[0].url : '';
    let solution: object | null = null;
    for (const path of Object.keys(schema.paths)) {
      const pathItem = schema.paths[path];
      if (pathItem.get && pathItem.get.responses['200']) {
        // console.log('Checking 200 response content', path, typeof pathItem.get.responses['200'].content);
        if (typeof pathItem.get.responses['200'].content !== 'object') {
          continue;
        }
        Object.keys(pathItem.get.responses['200'].content).forEach(
          (contentType) => {
            // console.log('Checking path', path, contentType);
            const response = pathItem.get.responses['200'].content[contentType];
            if (response.syncable) {
              // console.log('Found syncable response at path', path, contentType, response.syncable);
              const spec: SyncableSpec = {
                type: response.syncable.type || 'collection',
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
                params: response.syncable.params || {},
              };
              // console.log('baseUrl:', this.baseUrl, 'schema.servers:', schema.servers);
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
                  schema.paths[confirmOperationSpec.path][
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
                path,
                schema: response.schema,
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
  private getUrl(
    urlPath: string,
    theseParents: { [pattern: string]: string },
  ): URL {
    Object.entries(theseParents).forEach(([pattern, id]) => {
      const placeholder = `{${pattern}}`;
      urlPath = urlPath.replace(placeholder, id);
    });
    const joined = urljoin(this.baseUrl, urlPath);
    return new URL(joined);
  }

  private async doFetch(
    spec: SyncableSpec,
    url: string,
    headers: { [key: string]: string } = {},
    minNumItemsToExpect: number = 1,
  ): Promise<{ items: object[]; hasMore?: boolean; nextPageToken?: string }> {
    debug('Fetching', url, headers);
    const response = await this.fetchFunction(url, {
      headers: Object.assign({}, this.authHeaders, headers),
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log(
          `Warning: received 404 for URL ${url}, returning empty data`,
        );
        return { items: [] };
      } else {
        throw new Error(
          `Fetch error: ${response.status} ${response.statusText} for URL ${url} (${await response.text()})`,
        );
      }
    }

    const responseData = await response.json();
    // console.log('Fetched data from', url, responseData);
    // console.log('looking for items in response data using path', spec.itemsPathInResponse);
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
    if (spec.type === 'item') {
      items = [items];
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
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<object[]> {
    let allData: object[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = this.getUrl(this.syncables[syncableName].path, theseParents);
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
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<object[]> {
    let allData: object[] = [];
    let offset = 0;
    let hasMore = true;
    const spec = this.syncables[syncableName].spec;

    while (hasMore) {
      const url = this.getUrl(this.syncables[syncableName].path, theseParents);
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
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<object[]> {
    let allData: object[] = [];
    let nextPageToken: string | null = null;
    const spec = this.syncables[syncableName].spec;
    do {
      const url = this.getUrl(this.syncables[syncableName].path, theseParents);
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
  private async dateRangeFetch(
    syncableName: string,
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<object[]> {
    const spec = this.syncables[syncableName].spec;
    let allData: object[] = [];
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
      const url = this.getUrl(this.syncables[syncableName].path, theseParents);
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
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<object[]> {
    const spec = this.syncables[syncableName].spec;
    let allData: object[] = [];
    const numItemsPerPage = spec.forcePageSize || 20;
    let rangeHeader = `id ..; max=${numItemsPerPage}`;

    while (true) {
      const url = this.getUrl(this.syncables[syncableName].path, theseParents);
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
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<object[]> {
    const spec = this.syncables[syncableName].spec;
    let allData: object[] = [];
    let thisBatch: {
      items: object[];
      hasMore?: boolean;
      nextPageToken?: string;
    };
    do {
      thisBatch = await this.doFetch(
        spec,
        this.getUrl(this.syncables[syncableName].path, theseParents).toString(),
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
  private async doOneFetch(
    syncableName: string,
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<object[]> {
    const spec = this.syncables[syncableName].spec;
    switch (spec['paginationStrategy']) {
      case 'pageNumber':
        return this.pageNumberFetch(syncableName, theseParents);
      case 'offset':
        return this.offsetFetch(syncableName, theseParents);
      case 'pageToken':
        return this.pageTokenFetch(syncableName, theseParents);
      case 'dateRange':
        return this.dateRangeFetch(syncableName, theseParents);
      case 'rangeHeader':
        return this.rangeHeaderFetch(syncableName, theseParents);
      case 'confirmationBased':
        return this.confirmationBasedFetch(syncableName, theseParents);
      case 'none':
        return this.doFetch(
          spec,
          this.getUrl(
            this.syncables[syncableName].path,
            theseParents,
          ).toString(),
        ).then((res) => res.items);
      default:
        throw new Error(
          `Unknown paging strategy: ${spec['paginationStrategy']}`,
        );
    }
  }
  private async doFullFetch(
    syncableName: string,
    parents: {
      [pattern: string]: string[];
    },
  ): Promise<object[]> {
    for (let i = 0; i < Object.keys(parents).length; i++) {
      const pattern = Object.keys(parents)[i];
      if (parents[pattern].length > 1) {
        let allItems: object[] = [];
        for (let j = 0; j < parents[pattern].length; j++) {
          const singledOut = {};
          for (let k = 0; k < Object.keys(parents).length; k++) {
            if (k === i) {
              singledOut[pattern] = [parents[pattern][j]];
            } else {
              singledOut[Object.keys(parents)[k]] =
                parents[Object.keys(parents)[k]];
            }
          }
          // console.log('singled out a combination of parents', singledOut);
          const itemsForThisParent = await this.doFullFetch(
            syncableName,
            singledOut,
          );
          allItems = allItems.concat(itemsForThisParent);
        }
        return allItems;
      }
    }
    // if we reach here then all the parent patterns only have one value, so we can just fill those in and do one fetch
    // we also fill in any params that might be hardcoded in spec.query, for instance a `{ format: '.json' }`
    const theseParents: { [pattern: string]: string } = Object.assign(
      {},
      this.syncables[syncableName].spec.query || {},
    );
    Object.keys(parents).forEach((pattern) => {
      theseParents[pattern] = parents[pattern][0];
    });
    // console.log('now we can call doOneFetch for syncable', syncableName, 'with theseParents', theseParents);
    return (await this.doOneFetch(syncableName, theseParents)).map((obj) => {
      const copy = Object.assign({}, obj);
      Object.keys(theseParents).forEach((pattern) => {
        copy[pattern] = theseParents[pattern];
      });
      return copy;
    });
  }
  private paramTypes(params: { [key: string]: string }): {
    [key: string]: 'string' | 'number';
  } {
    const paramTypes: { [key: string]: 'string' | 'number' } = {};
    Object.entries(params || {}).forEach(([key, reference]) => {
      const [parentName, parentField] = reference.split('.');
      const parentFields = getFields(
        this.syncables[parentName].schema,
        this.syncables[parentName].spec,
      );
      if (!parentFields[parentField]) {
        throw new Error(
          `Invalid param reference ${reference}: could not find field ${parentField} in parent syncable ${parentName}`,
        );
      }
      const parentFieldType = parentFields[parentField].type;
      if (parentFieldType === 'string' || parentFieldType === 'number') {
        paramTypes[key] = parentFieldType;
      } else {
        throw new Error(
          `Unsupported field type for param reference ${reference}: field type is ${parentFieldType}`,
        );
      }
    });
    return paramTypes;
  }
  async fetchOneSyncable(
    specName: string,
    parents: { [pattern: string]: string[] },
  ): Promise<object[]> {
    const syncable = this.syncables[specName];
    // console.log(`Fetching syncable ${specName} with parents`, parents);
    const data = await this.doFullFetch(specName, parents);
    // console.log('initDb start');
    await this.initDb();
    // console.log('initDb end');
    if (this.client) {
      const fields = getFields(syncable.schema, syncable.spec);
      // console.log('creating table with fields', fields);
      const tableName = specName.split('.')[0];
      await createSqlTable(
        this.client,
        tableName,
        fields,
        syncable.spec.idField || 'id',
        this.paramTypes(syncable.spec.params || {}),
      );
      const fieldsToInsert: string[] = Object.keys(fields).filter(
        (f) => ['string'].indexOf(fields[f].type) !== -1,
      );
      Object.entries(parents).forEach(([pattern]) => {
        // console.log('adding parent pattern to fields to insert', pattern);
        if (!fieldsToInsert.includes(pattern)) {
          fieldsToInsert.push(pattern);
        }
      });
      await insertData(
        this.client,
        tableName,
        data,
        fieldsToInsert,
        syncable.spec.idField || 'id',
      );
    }
    return data;
  }
  async fullFetch(
    filter?: string[],
  ): Promise<{ [syncableName: string]: object[] }> {
    const allData: {
      [syncableName: string]: object[];
    } = {};
    let newData: boolean;
    const skipped: { [syncableName: string]: boolean } = {};
    await this.parseSpec();
    do {
      // console.log(
      //   'Starting loop of fetching all syncables, currently have data for syncables',
      //   Object.keys(allData),
      // );
      newData = false;
      for (const specName of Object.keys(this.syncables)) {
        if (filter && filter.indexOf(specName) === -1) {
          // console.log(
          //   'Skipping syncable',
          //   specName,
          //   'because it is not in the filter list',
          // );
          continue;
          // } else if (filter) {
          //   console.log(
          //     'Including syncable',
          //     specName,
          //     'because it is in the filter list',
          //   );
        }
        if (allData[specName]) {
          // console.log(
          //   `Already have data for syncable ${specName}, skipping...`,
          // );
          continue;
        }
        const syncable = this.syncables[specName];
        // console.log(
        //   'checking if we need parents for',
        //   specName,
        //   syncable.spec.params,
        // );
        const parents = {};
        if (syncable.spec.params) {
          // console.log(
          //   `Syncable ${specName} has params, determining parent data...`,
          //   syncable.spec.params,
          // );
          let missingParentData = false;
          Object.entries(syncable.spec.params).forEach(
            ([pattern, reference]) => {
              const parentName = reference.split('.')[0];
              if (!allData[parentName]) {
                // console.log(
                //   `Still missing parent data for syncable ${specName}: need parent ${parentName} based on param ${pattern}: ${reference}`,
                // );
                missingParentData = true;
                return;
              }
              // const idField = this.syncables[parentName].idField || 'id'; FIXME - can't we reuse this from there?
              const idField = reference.split('.')[1];
              // console.log('filling in parent pattern', pattern, 'with data from parent', parentName, 'using id field', idField);
              parents[pattern] = allData[parentName].map((item) =>
                item[idField].toString(),
              );
            },
          );
          if (missingParentData) {
            // console.log(
            //   `Skipping syncable ${specName} for now because we're still missing parent data...`,
            // );
            skipped[specName] = true;
            continue;
          }
          // console.log('all parents for syncable', specName, parents);
        }
        skipped[specName] = false;
        const data = await this.fetchOneSyncable(specName, parents);
        // console.log(
        //   'Fetched data for syncable',
        //   specName,
        //   'data length:',
        //   data.length,
        // );
        allData[specName] = data;
        newData = true;
      }
      //   'Finished one loop of fetching all syncables, checking if we have all data we need...',
      //   Object.keys(allData).length,
      //   Object.keys(this.syncables).length,
      // );
    } while (
      newData &&
      Object.keys(allData).length < Object.keys(this.syncables).length
    );
    Object.keys(skipped).forEach((specName) => {
      if (skipped[specName]) {
        const needed = Object.keys(this.syncables[specName].spec.params).map(
          (pattern) => {
            const reference = this.syncables[specName].spec.params[pattern];
            return reference.split('.')[0];
          },
        );
        const have = Object.keys(allData);
        console.log(
          `We had to skip syncable ${specName} because of missing parent data (needs [${needed.join(', ')}] and we have [${have.join(', ')}]).`,
        );
      }
    });
    if (this.client) {
      await this.client.end();
    }
    // console.log('All data fetched', allData);
    return allData;
  }
}
