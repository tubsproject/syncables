import { EventEmitter } from 'events';
import { default as urljoin } from 'url-join';
import { default as createDebug } from 'debug';
import { default as parse } from 'parse-link-header';
import { OpenAPIV3_1 } from '@scalar/openapi-types';
import { specStrToObj, getObjectPath } from './utils.js';
import { SyncableSpec, generateSyncableSpec } from './spec.js';
import { resolveRelations } from './relations.js';
import { TypedObject } from './schemaStore.js';

const debug = createDebug('syncable');

const MAX_PAGES = 100;

export type CollectionInput = {
  add?: string;
  list?: string;
};

export type CollectionSpec = {
  add?: { method: string; path: string };
  list?: { method: string; path: string };
  schema: OpenAPIV3_1.SchemaObject;
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
  relations: {
    [placeholder: string]: string;
  } = {};
  specStr: string;
  overlayStr: string | null = null;
  baseUrl: string;
  authHeaders: { [key: string]: string } = {};
  forcePageSize: number | null = null;
  collections: {
    [path: string]: CollectionSpec;
  } = {};
  constructor({
    specStr,
    overlayStr,
    authHeaders = {},
    fetchFunction = fetch,
    forcePageSize,
  }: {
    specStr: string;
    overlayStr?: string | null;
    authHeaders?: { [key: string]: string };
    fetchFunction?: typeof fetch;
    forcePageSize?: number;
  }) {
    super();
    this.specStr = specStr;
    this.overlayStr = overlayStr || null;
    this.forcePageSize = forcePageSize || null;
    this.authHeaders = authHeaders;
    this.fetchFunction = fetchFunction;
  }
  private async getCollections(doc: OpenAPIV3_1.Document): Promise<void> {
    const collections: {
      [path: string]: CollectionSpec;
    } = {};
    Object.entries(
      (doc.components as { collections?: { [key: string]: CollectionInput } })
        .collections || {},
    ).forEach(([collectionPath, collectionInput]) => {
      const collection: {
        add?: { method: string; path: string };
        list?: { method: string; path: string };
        schema?: OpenAPIV3_1.SchemaObject;
      } = {};
      if (collectionInput.list) {
        const [method, path] = collectionInput.list.toLowerCase().split(' ');
        const pathItem = doc.paths?.[path];
        if (!pathItem) {
          throw new Error(
            `Invalid collection definition: path ${path} not found in spec`,
          );
        }
        if (!pathItem[method]) {
          throw new Error(
            `Invalid collection definition: method ${method} not found for path ${path} in spec`,
          );
        }
        // console.log('finding responses', pathItem);
        const responseSchema =
          pathItem[method].responses?.['200']?.content?.['application/json']
            ?.schema;
        if (!responseSchema) {
          throw new Error(
            `Invalid collection definition: no response schema found for path ${path} method ${method}`,
          );
        }
        collection.list = { method, path };
        collection.schema = responseSchema;
      }
      if (collectionInput.add) {
        const [method, path] = collectionInput.add.toLowerCase().split(' ');
        const pathItem = doc.paths?.[path];
        if (!pathItem) {
          throw new Error(
            `Invalid collection definition: path ${path} not found in spec`,
          );
        }
        if (!pathItem[method]) {
          throw new Error(
            `Invalid collection definition: method ${method} not found for path ${path} in spec`,
          );
        }
        const requestBodySchema =
          pathItem[method].requestBody?.content?.['application/json']?.schema;
        if (!requestBodySchema) {
          throw new Error(
            `Invalid collection definition: no request body schema found for path ${path} method ${method}`,
          );
        }
        // if (collection.schema && JSON.stringify(collection.schema) !== JSON.stringify(requestBodySchema)) {
        //   throw new Error(`Mismatching schemas for list and add operations of collection ${collectionPath}`);
        // }
        collection.add = { method, path };
        collection.schema = requestBodySchema;
      }
      collections[collectionPath] = collection as CollectionSpec;
    });
    this.collections = collections;
  }

  async parseSpec(): Promise<void> {
    const doc = await specStrToObj(this.specStr, this.overlayStr);
    // console.log('Parsed spec document', Object.keys(doc.components));
    this.baseUrl =
      doc.servers && doc.servers.length > 0 ? doc.servers[0].url : '';
    if (this.baseUrl.startsWith('//')) {
      this.baseUrl = 'https:' + this.baseUrl;
    }
    const paginationScheme =
      doc?.components?.['paginationSchemes']?.['default'];
    if (!paginationScheme) {
      throw new Error('undefined pagination scheme');
    }
    const relations = (
      doc.components as unknown as {
        relations?: { parameters?: { [parameterName: string]: string } };
      }
    )?.relations;
    const parametersNames = Object.keys(relations?.parameters || {});
    parametersNames.forEach((paramName) => {
      this.relations[paramName] = relations.parameters?.[paramName];
    });
    console.log('this.relations from OAD components.relations', this.relations);

    // let solution: object | null = null;
    for (const path of Object.keys(doc.paths)) {
      const pathItem = doc.paths[path];
      if (pathItem.get) {
        console.log('found GET path', path);
        const spec = generateSyncableSpec(path, doc);
        if (spec.paginationStrategy !== 'none') {
          // FIXME: this it to make google.test.ts pass
          this.syncables[path] = {
            path,
            spec,
            schema:
              pathItem.get.responses?.['200']?.content?.['application/json']
                ?.schema,
          };
        }
      }
    }
    // console.log('found syncables', this.syncables);
    await this.getCollections(doc);
    // console.log('collections', this.collections);
    // throw new Error(`No syncables found in spec`);
  }
  private getUrl(
    urlPath: string,
    theseParents: { [pattern: string]: string },
  ): URL {
    Object.entries(theseParents).forEach(([pattern, id]) => {
      const placeholder = `{${pattern}}`;
      urlPath = urlPath.replace(placeholder, id);
    });
    // console.log('joining URL for path', urlPath, 'with parents', theseParents);
    const joined = urljoin(this.baseUrl, urlPath);
    // console.log('joined URL', joined);
    if (joined.indexOf('{') !== -1) {
      throw new Error(
        `Not all placeholders in URL path ${urlPath} were replaced, got ${joined}`,
      );
    }
    return new URL(joined);
  }

  private async doFetch(
    spec: SyncableSpec,
    url: string,
    headers: { [key: string]: string } = {},
    minNumItemsToExpect: number = 1,
  ): Promise<{
    items: object[];
    schema: OpenAPIV3_1.SchemaObject;
    hasMore?: boolean;
    nextPageToken?: string;
    nextUrl?: string;
  }> {
    debug('Fetching', url, headers);
    const response = await this.fetchFunction(url, {
      headers: Object.assign({}, this.authHeaders, headers),
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log(
          `Warning: received 404 for URL ${url}, returning empty data`,
        );
        return { items: [], schema: {} };
      } else {
        throw new Error(
          `Fetch error: ${response.status} ${response.statusText} for URL ${url} (${await response.text()})`,
        );
      }
    }
    // console.log('finding responses', spec);
    const schema =
      spec.responses?.[response.status.toString()]?.content?.[
        response.headers.get('Content-Type')
      ]?.schema;
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
    const responseLinkHeaders = response.headers.get('Link');
    const parsed = parse(responseLinkHeaders || '');
    let nextUrl: string | undefined = undefined;
    if (parsed && parsed.next && parsed.next.url) {
      nextPageToken = parsed.next.url;
      nextUrl = parsed.next.url;
    }
    // console.log('response link headers', responseLinkHeaders, parsed);
    // const responseHeaders = Object.fromEntries((response.headers as unknown as { entries: () => Iterable<[string, string]> }).entries());
    // console.log('response headers', responseHeaders);
    // console.log('hasMore', items.length, minNumItemsToExpect);
    // throw new Error('debug');
    return {
      items,
      hasMore: items.length >= minNumItemsToExpect,
      nextPageToken,
      nextUrl,
      schema,
    };
  }
  private async pageNumberFetch(
    syncableName: string,
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<{ data: object[]; schema: OpenAPIV3_1.SchemaObject }> {
    let allData: object[] = [];
    let page = 1;
    let hasMore = true;
    let schema;
    while (hasMore) {
      const url = this.getUrl(this.syncables[syncableName].path, theseParents);
      const spec = this.syncables[syncableName].spec;
      Object.entries(spec.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      url.searchParams.append(spec.pageNumberParamInQuery, page.toString());
      if (this.forcePageSize) {
        const param = spec.forcePageSizeParamInQuery || 'pageSize';
        url.searchParams.append(param, this.forcePageSize.toString());
      }

      const data = await this.doFetch(
        spec,
        url.toString(),
        {},
        this.forcePageSize || spec.defaultPageSize || 1,
      );
      schema = data.schema;
      allData = allData.concat(data.items);
      hasMore = data.hasMore;
      page += 1;
    }

    return { data: allData, schema };
  }

  private async offsetFetch(
    syncableName: string,
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<{ data: object[]; schema: OpenAPIV3_1.SchemaObject }> {
    let allData: object[] = [];
    let offset = 0;
    let hasMore = true;
    const spec = this.syncables[syncableName].spec;
    let pages = 0;
    while (hasMore && pages++ < MAX_PAGES) {
      const url = this.getUrl(this.syncables[syncableName].path, theseParents);
      Object.entries(spec.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      url.searchParams.append(spec.offsetParamInQuery, offset.toString());
      if (this.forcePageSize) {
        const param = spec.forcePageSizeParamInQuery || 'pageSize';
        url.searchParams.append(param, this.forcePageSize.toString());
      }

      const data = await this.doFetch(
        spec,
        url.toString(),
        {},
        this.forcePageSize || spec.defaultPageSize || 1,
      );
      allData = allData.concat(data.items);
      hasMore = data.hasMore;
      offset += data.items.length;
    }

    return { data: allData, schema: {} };
  }

  private async pageTokenFetch(
    syncableName: string,
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<{ data: object[]; schema: OpenAPIV3_1.SchemaObject }> {
    let allData: object[] = [];
    let nextPageToken: string | null = null;
    const spec = this.syncables[syncableName].spec;
    let pages = 0;
    do {
      const url = this.getUrl(this.syncables[syncableName].path, theseParents);
      Object.entries(spec.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      if (this.forcePageSize) {
        const param = spec.forcePageSizeParamInQuery || 'pageSize';
        url.searchParams.append(param, this.forcePageSize.toString());
      }
      if (nextPageToken) {
        url.searchParams.append(spec.pageTokenParamInQuery, nextPageToken);
      }
      const data = await this.doFetch(
        spec,
        url.toString(),
        {},
        this.forcePageSize || spec.defaultPageSize || 1,
      );
      // console.log('fetched', data);
      allData = allData.concat(data.items);
      nextPageToken = data.nextPageToken || null;
    } while (nextPageToken && ++pages < MAX_PAGES);

    return { data: allData, schema: {} };
  }
  private async linkHeaderFetch(
    syncableName: string,
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<{ data: object[]; schema: OpenAPIV3_1.SchemaObject }> {
    let allData: object[] = [];
    const spec = this.syncables[syncableName].spec;
    let url = this.getUrl(this.syncables[syncableName].path, theseParents);
    let pages = 0;
    do {
      Object.entries(spec.query || {}).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      if (this.forcePageSize) {
        const param = spec.forcePageSizeParamInQuery || 'pageSize';
        url.searchParams.append(param, this.forcePageSize.toString());
      }
      const data = await this.doFetch(
        spec,
        url.toString(),
        {},
        this.forcePageSize || spec.defaultPageSize || 1,
      );
      // console.log('fetched', data);
      allData = allData.concat(data.items);
      if (data.nextUrl) {
        url = new URL(data.nextUrl);
      } else {
        url = null;
      }
      // console.log('URL is now', url);
    } while (url && ++pages < MAX_PAGES);

    return { data: allData, schema: {} };
  }

  private async rangeHeaderFetch(
    syncableName: string,
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<{ data: object[]; schema: OpenAPIV3_1.SchemaObject }> {
    const spec = this.syncables[syncableName].spec;
    let allData: object[] = [];
    const numItemsPerPage = this.forcePageSize || 20;
    let rangeHeader = `id ..; max=${numItemsPerPage}`;
    let pages = 0;
    while (pages++ < MAX_PAGES) {
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

    return { data: allData, schema: {} };
  }

  private async confirmationBasedFetch(
    syncableName: string,
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<{ data: object[]; schema: OpenAPIV3_1.SchemaObject }> {
    const spec = this.syncables[syncableName].spec;
    let allData: object[] = [];
    let thisBatch: {
      items: object[];
      hasMore?: boolean;
      nextPageToken?: string;
    };
    let pages = 0;
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
    } while (thisBatch.hasMore && ++pages < MAX_PAGES);
    return { data: allData, schema: {} };
  }
  private async doOneFetch(
    syncableName: string,
    theseParents: {
      [pattern: string]: string;
    },
  ): Promise<{ data: object[]; schema: OpenAPIV3_1.SchemaObject }> {
    const spec = this.syncables[syncableName].spec;
    // console.log('switching on pagination strategy', spec.paginationStrategy);
    // console.log(spec);
    // throw new Error('debug');
    switch (spec['paginationStrategy']) {
      case 'pageNumber':
        return this.pageNumberFetch(syncableName, theseParents);
      case 'offset':
        return this.offsetFetch(syncableName, theseParents);
      case 'pageToken':
        return this.pageTokenFetch(syncableName, theseParents);
      case 'rangeHeader':
        return this.rangeHeaderFetch(syncableName, theseParents);
      case 'confirmationBased':
        return this.confirmationBasedFetch(syncableName, theseParents);
      case 'linkHeader':
        return this.linkHeaderFetch(syncableName, theseParents);
      case 'none':
        return this.doFetch(
          spec,
          this.getUrl(
            this.syncables[syncableName].path,
            theseParents,
          ).toString(),
        ).then((res) => {
          console.log('no pagination here', res);
          if (Array.isArray(res.items)) {
            return { data: res.items, schema: res.schema };
          } else {
            return { data: [res.items], schema: res.schema };
          }
        });
      default:
        throw new Error(
          `Unknown paging strategy for ${syncableName}: ${spec['paginationStrategy']}`,
        );
    }
  }

  async fullFetch(
    callback: (
      syncableName: string,
      items: TypedObject,
    ) => Promise<void> = () => Promise.resolve(),
    params: { [placeholder: string]: string } = {},
    filter?: string[],
  ): Promise<{ [syncableName: string]: TypedObject }> {
    const allData: {
      [syncableName: string]: TypedObject;
    } = {};
    await this.parseSpec();
    Object.keys(this.relations).forEach((placeholder) => {
      params[placeholder] = this.relations[placeholder];
    });
    console.log('params including relations', params);

    let newData;
    do {
      newData = false;
      console.log(
        'Starting loop of fetching all syncables, currently have data for syncables',
        Object.keys(allData),
      );
      const syncableNames = Object.keys(this.syncables).filter((specName) => {
        if (filter && filter.indexOf(specName) === -1) {
          console.log(
            'Skipping syncable',
            specName,
            'because it is not in the filter list',
          );
          return false;
        } else if (filter) {
          console.log(
            'Including syncable',
            specName,
            'because it is in the filter list',
          );
        }
        return true;
      });
      const fetchAndFillIn = async (
        syncableName: string,
        theseParents: {
          [pattern: string]: string;
        },
      ): Promise<TypedObject> => {
        const { data: dataIn, schema } = await this.doOneFetch(
          syncableName,
          theseParents,
        );
        const data = dataIn.map((obj) => {
          const copy = Object.assign({}, obj);
          Object.keys(theseParents).forEach((pattern) => {
            copy[pattern] = theseParents[pattern];
          });
          return copy;
        });
        await callback(syncableName, { data, schema: {} }).catch((err) => {
          console.log(
            `Error in callback for syncable ${syncableName} with parents ${JSON.stringify(theseParents)}:`,
            err,
          );
          return err;
        });
        return { data, schema };
      };
      const result = await resolveRelations(
        syncableNames,
        params,
        allData,
        fetchAndFillIn,
      );
      // console.log('result from resolveRelations', result);
      // console.log('allData is now', allData);
      Object.keys(result).forEach((syncableName) => {
        newData = true;
        allData[syncableName] = {
          data: ((allData[syncableName]?.data as object[]) || []).concat(
            result[syncableName].data,
          ),
          schema: allData[syncableName]?.schema,
        };
      });
      // console.log('added to allData', allData);
      console.log(
        'Finished one loop of fetching all syncables, checking if we have all data we need...',
        Object.keys(allData).length,
        Object.keys(this.syncables).length,
      );
    } while (
      newData &&
      Object.keys(allData).length < Object.keys(this.syncables).length
    );
    // console.log('All data fetched', allData);
    return allData;
  }
  async checkSchema(
    schema: OpenAPIV3_1.SchemaObject,
    item: object | string | number | boolean | null,
  ): Promise<void> {
    if (schema.type === 'object') {
      if (typeof item !== 'object' || item === null) {
        console.log(`Expected object but got ${typeof item}`);
      }
      if (schema.properties) {
        for (const key of Object.keys(schema.properties)) {
          if (item[key] === undefined) {
            console.log(`Missing required property ${key}`);
          }
          await this.checkSchema(
            schema.properties[key] as OpenAPIV3_1.SchemaObject,
            item[key],
          );
        }
      }
    } else if (schema.type === 'array') {
      if (!Array.isArray(item)) {
        throw new Error(`Expected array but got ${typeof item}`);
      }
      const itemSchema = schema.items as OpenAPIV3_1.SchemaObject;
      for (const element of item) {
        await this.checkSchema(itemSchema, element);
      }
    } else {
      const type = typeof item;
      if (type !== schema.type) {
        console.log(`Expected type ${schema.type} but got ${type}`);
      }
    }
  }
  async addItem(
    collection,
    item,
    parameters: { [placeholder: string]: string },
  ): Promise<void> {
    if (!this.collections[collection]) {
      throw new Error('collection unknown');
    }
    console.log('adding item to collection', collection, item);
    const path = this.collections[collection].add.path;
    const method = this.collections[collection].add.method;
    // const schema = this.collections[collection].schema;
    // this.checkSchema(schema, item);
    const url = this.getUrl(path, parameters);
    console.log('constructed URL for adding item', url.toString());
    const response = await this.fetchFunction(url.toString(), {
      method,
      headers: Object.assign(
        {
          'Content-Type': 'application/json',
        },
        this.authHeaders,
      ),
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error(
        `Error adding item to collection ${collection}: ${response.status} ${response.statusText} (${await response.text()})`,
      );
    }
  }
}
