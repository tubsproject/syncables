import { getSpec } from './openApi.js';
import { createSqlTable, getFields, Client, getPostgresClient } from './db.js';
import { insertData } from './devonian.js';
import { fetchData, getXmlDoc, sendXmlDoc } from './client.js';
import { translationFunctions } from './translation.js';
import { genDoc } from './genDoc.js';
import { toPeppyrusMessageBody, toMaventaInvoiceBody, toRecommandInvoiceBody } from './parse.js';
// import { runOAuthClient } from './oauth.js';

export class Syncable {
  collectionName: string;
  specFilename: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  specObject: { syncables: { [key: string]: any } } | undefined;
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
  async init(): Promise<void> {
    try {
      this.specObject = await getSpec(this.specFilename);
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
          this.specObject.syncables[syncableName].get?.path ||
          this.specObject.syncables[syncableName].hydra;
        if (this.specObject.syncables[syncableName].get !== undefined) {
          const fields = getFields(
            this.specObject,
            endPoint,
            this.specObject.syncables[syncableName].get.field,
          );
          await createSqlTable(this.client, tableName, fields);
          const data = await fetchData(
            this.specObject as unknown as { servers: { url: string }[] },
            endPoint,
            this.authHeaders,
          );
          // call fetchXmlDoc on each item if needed
          if (
            typeof this.specObject.syncables[syncableName]['get-doc'] !==
            'undefined'
          ) {
            console.log(`Fetching XML document for ${syncableName}`);
            for (const item of data[
              this.specObject.syncables[syncableName].get.field
            ]) {
              const xmlDoc = await getXmlDoc(
                this.specObject as unknown as { servers: { url: string }[] },
                this.specObject.syncables[syncableName]['get-doc'].path.replace(
                  '{id}',
                  item.id,
                ),
                this.authHeaders,
              );
              // Do something with xmlDoc
              void xmlDoc;
            }
          }
          await insertData(
            this.client,
            translationFunctions,
            tableName,
            data[this.specObject.syncables[syncableName].get.field],
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
          const data = await fetchData(
            this.specObject as unknown as { servers: { url: string }[] },
            endPoint,
            this.authHeaders,
          );
          await insertData(
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendTestDocument(senderId: string, receiverId: string, addDocSpec: any): Promise<void> {
    let testInvoice = genDoc('invoice', senderId, receiverId, 'asdf');
    const translationsFunctions = {
      toPeppyrusMessageBody,
      toMaventaInvoiceBody,
      toRecommandInvoiceBody,
    }
    if (typeof addDocSpec.translation !== 'undefined') {
      const translationFunctionName = addDocSpec.translation;
      if (typeof translationsFunctions[translationFunctionName] === 'undefined') {
        throw new Error(`No translation function named ${translationFunctionName} found`);
      }
      console.log(`Translating test document using ${translationFunctionName}`);
      testInvoice = translationsFunctions[translationFunctionName](testInvoice);
    }
    await sendXmlDoc(
      this.specObject as unknown as { servers: { url: string }[] },
      addDocSpec.path,
      this.authHeaders,
      testInvoice,
    ).then((responseXml: string): void => {
      console.log(
        `Received response from ${this.collectionName}:`,
        responseXml,
      );
    }).catch((error: Error): void => {
      console.error(
        `Error sending document to ${this.collectionName}:`,
        error,
      );
    });
  }
  async sendTestDocuments(): Promise<void> {
    const promises = Object.keys(this.specObject.syncables).filter((syncableName: string): boolean => {
      return (
        typeof this.specObject.syncables[syncableName]['add-doc'] !==
        'undefined'
      );
    }).map(async (syncableName: string): Promise<void> => {
      const testAccounts = {
        // arratech: '0208:0607778343', // works (waiting for SMP on test infra to come through)
        acube: '9915:asdffbddsf', // works
        ion: '0106:test-12345678', // works
        peppyrus: '9944:nl862637223B02', // works
        // recommand: '0208:123454321', // todo
        // netfly: '0208:1023290711', // todo
        // maventa: '0208:0628374655', // todo
        // scrada: '0208:0654321876', // todo
        // billberry: todo
        // dokapi: todo
        // e-invoice-be: todo
        // primexchange: todo
      };
      if (typeof testAccounts[this.collectionName] !== 'string') {
        console.log(`No test account defined for ${this.collectionName}, skipping test document send`);
        return;
      }
      await Promise.all(Object.keys(testAccounts).map(async (key) => {
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
      }));
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
    authHeaders = JSON.parse(
      process.env[envKey],
    );
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
    ).filter(name => !['ion', 'peppyrus', 'arratech', 'maventa', 'acube', 'recommand'].includes(name));
  console.log('Platforms to sync:', platformsList);
  await Promise.all(
    platformsList.map(async (platform) => {
      const collectionName = platform;
      console.log('calling getSyncable', collectionName);
      const syncable = await getSyncable(collectionName, client);
      console.log('syncable created, calling init', collectionName);
      // void syncable;
      await syncable.init();
      console.log('syncable initialized, calling sendTestDocument', collectionName);
      // await syncable.sendTestDocuments();
      await syncable.run();
    }),
  );
  await client.end();
}
