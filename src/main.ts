import { getSpec } from './openApi.js';
import {
  createSqlTable,
  getFields,
  Client,
  getPostgresClient,
  insertData,
} from './db.js';
import { insertDevonian } from './devonian.js';
import { fetchData, getXmlDoc, sendXmlDoc } from './client.js';
import { translationFunctions } from './translation.js';
import { genDoc } from './genDoc.js';
import {
  toPeppyrusMessageBody,
  toMaventaInvoiceBody,
  toRecommandInvoiceBody,
} from './parse.js';
// import { runOAuthClient } from './oauth.js';

function getListUrl(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listSpec: { [key: string]: any },
  endPoint: string,
): string {
  const query: { [key: string]: string } = {};
  console.log(
    'syncableSpec for getListUrl:',
    JSON.stringify(listSpec, null, 2),
  );
  if (listSpec !== undefined && listSpec.query !== undefined) {
    Object.assign(query, listSpec.query);
  }
  if (typeof listSpec?.paging?.startDateParam === 'string') {
    // console.log('Adding startDateParam to query', listSpec?.paging?.startDateParam);
    query[listSpec?.paging?.startDateParam] = '20000101000000';
    // console.log('Query after adding startDateParam:', query);
    // } else {
    // console.log('No startDateParam defined in paging spec', listSpec?.paging);
  }
  if (typeof listSpec?.paging?.endDateParam === 'string') {
    // console.log('Adding endDateParam to query', listSpec?.paging?.endDateParam);
    query[listSpec?.paging?.endDateParam] = '99990101235959';
    // console.log('Query after adding endDateParam:', query);
    // } else {
    // console.log('No endDateParam defined in paging spec', listSpec?.paging);
  }

  if (Object.keys(query).length > 0) {
    const queryParams = new URLSearchParams(query).toString();
    console.log(`Using query params for list endpoint:`, queryParams);
    return endPoint.concat(`?${queryParams}`);
  }
  return endPoint;
}

export class Syncable {
  collectionName: string;
  specFilename: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  specObject: { syncables: { [key: string]: any } } | undefined;
  specObjectServerUrl: string | undefined;
  authHeaders: { [key: string]: string };
  client: Client;
  translationFunctions: {
    [key: string]: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context: any;
    };
  };
  constructor(
    collectionName: string,
    specFilename: string,
    authHeaders: { [key: string]: string },
    client: Client,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    translationFunctions: { [key: string]: { fn: any; context: any } },
  ) {
    this.collectionName = collectionName;
    this.specFilename = specFilename;
    this.authHeaders = authHeaders;
    this.client = client;
    this.translationFunctions = translationFunctions;
  }
  async init(serverIndex: number): Promise<void> {
    try {
      this.specObject = await getSpec(this.specFilename);
      this.specObjectServerUrl = (
        this.specObject as unknown as { servers: { url: string }[] }
      ).servers[serverIndex].url;
      console.log(
        `Using server URL ${serverIndex} for ${this.collectionName}: ${this.specObjectServerUrl}`,
      );
    } catch (error) {
      throw new Error(
        `Failed to load OpenAPI spec from ${this.specFilename}: ${error}`,
      );
    }
  }
  async run(): Promise<void> {
    await Promise.all(
      Object.keys(this.specObject.syncables).map(async (syncableName) => {
        const tableName = `${this.collectionName}_${syncableName}`;
        console.log(
          `Creating syncable ${this.specObject.syncables[syncableName].type}: ${syncableName} as ${tableName}`,
        );
        const endPoint =
          this.specObject.syncables[syncableName]['list']?.path ||
          this.specObject.syncables[syncableName].hydra;
        if (this.specObject.syncables[syncableName]['list'] !== undefined) {
          const fields = getFields(
            this.specObject,
            endPoint,
            this.specObject.syncables[syncableName]['list'].field,
          );
          console.log(
            'Found list endpoint for syncable',
            syncableName,
            'with fields:',
            fields,
          );
          await createSqlTable(this.client, tableName, fields);
          const url = getListUrl(
            this.specObject.syncables[syncableName]['list'],
            endPoint,
          );
          const data = await fetchData(
            this.specObjectServerUrl,
            url,
            this.authHeaders,
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let dataItems: any[] = [];
          // call fetchXmlDoc on each item if needed
          if (
            typeof this.specObject.syncables[syncableName]['get-doc'] !==
            'undefined'
          ) {
            console.log(
              `Fetching XML document for ${syncableName}`,
              this.specObject.syncables[syncableName]['get-doc'],
            );
            console.log(
              'iterating over items:',
              data,
              this.specObject.syncables[syncableName]['list'],
            );
            if (
              typeof this.specObject.syncables[syncableName]['list'].field ===
              'undefined'
            ) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              dataItems = data as any[];
              console.log('dataItems from response root:', dataItems);
            } else {
              dataItems = data[
                this.specObject.syncables[syncableName]['list'].field
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ] as any[];
              console.log(
                'dataItems based on field:',
                this.specObject.syncables[syncableName]['list'].field,
                dataItems,
              );
            }
            if (!Array.isArray(dataItems)) {
              throw new Error(
                `Expected data items to be an array, got: ${JSON.stringify(dataItems)}`,
              );
            }
            for (let i = 0; i < dataItems.length; i++) {
              const item = dataItems[i];
              const xmlDoc = await getXmlDoc(
                this.specObjectServerUrl,
                this.specObject.syncables[syncableName]['get-doc'].path
                  .replace('{id}', item.id)
                  .replace('{documentID}', item.id),
                this.authHeaders,
              );
              // Do something with xmlDoc
              void xmlDoc;
            }
          }
          await insertData(
            this.client,
            tableName,
            dataItems,
            Object.keys(fields).filter((x) =>
              ['string', 'integer' /*'boolean'*/].includes(fields[x].type),
            ),
          );
          await insertDevonian(
            this.client,
            translationFunctions,
            tableName,
            dataItems,
            Object.keys(fields).filter((x) =>
              ['string', 'integer' /*'boolean'*/].includes(fields[x].type),
            ),
          );
        } else if (
          this.specObject.syncables[syncableName].hydra !== undefined
        ) {
          const fields = getFields(this.specObject, endPoint, 'hydra:member');
          fields['@context'] = { type: 'string' };
          await createSqlTable(this.client, tableName, fields);
          const url = getListUrl(
            this.specObject.syncables[syncableName]['list'],
            endPoint,
          );
          const data = await fetchData(
            this.specObjectServerUrl,
            url,
            this.authHeaders,
          );
          await insertDevonian(
            this.client,
            translationFunctions,
            tableName,
            data['hydra:member'],
            Object.keys(fields).filter((x) =>
              ['string', 'integer' /*'boolean'*/].includes(fields[x].type),
            ),
          );
        }
      }),
    );
  }
  async sendTestDocument(
    senderId: string,
    receiverId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addDocSpec: any,
  ): Promise<void> {
    let testInvoice = genDoc('invoice', senderId, receiverId, 'asdf');
    const translationsFunctions = {
      toPeppyrusMessageBody,
      toMaventaInvoiceBody,
      toRecommandInvoiceBody,
    };
    if (typeof addDocSpec.translation !== 'undefined') {
      const translationFunctionName = addDocSpec.translation;
      if (
        typeof translationsFunctions[translationFunctionName] === 'undefined'
      ) {
        throw new Error(
          `No translation function named ${translationFunctionName} found`,
        );
      }
      console.log(`Translating test document using ${translationFunctionName}`);
      testInvoice = translationsFunctions[translationFunctionName](testInvoice);
    }
    await sendXmlDoc(
      this.specObject as unknown as { servers: { url: string }[] },
      this.specObjectServerUrl,
      addDocSpec.path,
      this.authHeaders,
      testInvoice,
    )
      .then((responseXml: string): void => {
        console.log(
          `Received response from ${this.collectionName}:`,
          responseXml,
        );
      })
      .catch((error: Error): void => {
        console.error(
          `Error sending document to ${this.collectionName}:`,
          error,
        );
      });
  }
  async sendTestDocuments(): Promise<void> {
    const promises = Object.keys(this.specObject.syncables)
      .filter((syncableName: string): boolean => {
        return (
          typeof this.specObject.syncables[syncableName]['add-doc'] !==
          'undefined'
        );
      })
      .map(async (syncableName: string): Promise<void> => {
        const testAccounts = {
          acube: '9915:asdffbddsf', // works
          // arratech: '0208:0607778343', // works (waiting for SMP on test infra to come through)
          ion: '0106:test-12345678', // works
          // maventa: '0208:0628374655', // todo
          // netfly: '0208:1023290711', // todo
          peppyrus: '9944:nl862637223B02', // works
          // recommand: '0208:123454321', // todo
          // scrada: '0208:0654321876', // todo
          // e-invoice-be: todo
          // dokapi: todo
          // billberry: todo
          // primexchange: todo
        };
        if (typeof testAccounts[this.collectionName] !== 'string') {
          console.log(
            `No test account defined for ${this.collectionName}, skipping test document send`,
          );
          return;
        }
        await Promise.all(
          Object.keys(testAccounts).map(async (key) => {
            if (key !== this.collectionName) {
              console.log(
                `* Sending test document from ${this.collectionName} to ${key}`,
                this.specObject?.syncables[syncableName]['add-doc'],
              );
              await this.sendTestDocument(
                testAccounts[this.collectionName],
                testAccounts[key],
                this.specObject?.syncables[syncableName]['add-doc'],
              );
            }
          }),
        );
      });
    await Promise.all(promises);
  }
}

async function getSyncable(
  collectionName: string,
  client: Client,
): Promise<Syncable> {
  const openApiSpecFilename = `openapi/generated/${collectionName}.yaml`;
  const envKey = `${collectionName.toUpperCase().replace('-', '_')}_AUTH_HEADERS`;
  if (!process.env[envKey]) {
    throw new Error(`Skipping ${collectionName} because ${envKey} is not set`);
  }
  // console.log(
  //   `Creating Syncable for ${collectionName} using ${openApiSpecFilename}`,
  // );
  let authHeaders: { [key: string]: string };
  try {
    authHeaders = JSON.parse(process.env[envKey]);
  } catch (error) {
    throw new Error(`Failed to parse ${envKey}: ${error.message}`);
  }
  return new Syncable(
    collectionName,
    openApiSpecFilename,
    authHeaders,
    client,
    translationFunctions,
  );
}

export async function run(): Promise<void> {
  const client = await getPostgresClient();
  // get list of backend platforms from env vars
  const platformsList = Object.keys(process.env)
    .filter((x) => x.endsWith('_AUTH_HEADERS'))
    .map((x) =>
      x
        .substring(0, x.length - '_AUTH_HEADERS'.length)
        .toLowerCase()
        .replace('_', '-'),
    );
  console.log('Platforms to sync:', platformsList);
  await Promise.all(
    platformsList.map(async (platform) => {
      const collectionName = platform;
      console.log('calling getSyncable', collectionName);
      const syncable = await getSyncable(collectionName, client);
      console.log('syncable created, calling init', collectionName);
      // void syncable;
      let serverIndex = 0;
      if (
        typeof process.env[
          `${collectionName.toUpperCase().replace('-', '_')}_SERVER_INDEX`
        ] !== 'undefined'
      ) {
        const idx = parseInt(
          process.env[
            `${collectionName.toUpperCase().replace('-', '_')}_SERVER_INDEX`
          ],
          10,
        );
        if (!isNaN(idx)) {
          serverIndex = idx;
        }
      }
      await syncable.init(serverIndex);
      console.log(
        'syncable initialized, calling sendTestDocument',
        collectionName,
      );
      // await syncable.sendTestDocuments();
      await syncable.run();
    }),
  );
  await client.end();
}
