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
    this.specObject = await getSpec(this.specFilename);
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
  async sendTestDocument(): Promise<void> {
    const promises = Object.keys(this.specObject.syncables).filter((syncableName: string): boolean => {
      return (
        typeof this.specObject.syncables[syncableName]['add-doc'] !==
        'undefined'
      );
    }).map(async (syncableName: string): Promise<void> => {
      console.log(
        `Sending test document to ${this.collectionName} ${syncableName} using ${this.specFilename}`,
        this.specObject?.syncables[syncableName]['add-doc'],
      );

      const testAccounts = {
        // acube: '0208:0734825676',
        // ion: '0208:0636984350',
        // peppyrus: '9944:nl862637223B02',
        recommand: '0208:123454321',
        recipient: '9944:nl862637223B03',
      };
      if (typeof testAccounts[this.collectionName] !== 'string') {
        console.log(`No test account defined for ${this.collectionName}, skipping test document send`);
        return;
      }
      let testInvoice = genDoc('invoice', testAccounts[this.collectionName], testAccounts['recipient'], 'asdf');
      const translationsFunctions = {
        toPeppyrusMessageBody,
        toMaventaInvoiceBody,
        toRecommandInvoiceBody,
      }
      if (typeof this.specObject?.syncables[syncableName]['add-doc'].translation !== 'undefined') {
        const translationFunctionName = this.specObject?.syncables[syncableName]['add-doc'].translation;
        if (typeof translationsFunctions[translationFunctionName] === 'undefined') {
          throw new Error(`No translation function named ${translationFunctionName} found`);
        }
        console.log(`Translating test document using ${translationFunctionName}`);
        testInvoice = translationsFunctions[translationFunctionName](testInvoice);
      }
      sendXmlDoc(
        this.specObject as unknown as { servers: { url: string }[] },
        this.specObject.syncables[syncableName]['add-doc'].path,
        this.authHeaders,
        testInvoice,
      ).then((responseXml: string): void => {
        console.log(
          `Received response from ${this.collectionName} ${syncableName}:`,
          responseXml,
        );
      }).catch((error: Error): void => {
        console.error(
          `Error sending document to ${this.collectionName} ${syncableName}:`,
          error,
        );
      });
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
  console.log(
    `Creating collection for ${collectionName} using ${openApiSpecFilename}`,
  );
  const authHeaders: { [key: string]: string } = JSON.parse(
    process.env[envKey],
  );
  return new Syncable(
    collectionName,
    openApiSpecFilename,
    authHeaders,
    client,
    translationFunctions,
  );
}

async function createCollections(
  collectionName: string,
  client: Client,
): Promise<void> {
  const syncable = await getSyncable(collectionName, client);
  await syncable.init();
  await syncable.run();
}

async function sendTestDocument(
  collectionName: string,
  client: Client,
): Promise<void> {
  const syncable = await getSyncable(collectionName, client);
  await syncable.init();
  await syncable.sendTestDocument();
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
    platformsList.map((platform) => {
      void createCollections;
      // createCollections(platform, client);
      sendTestDocument(platform, client);
    }),
  );
  await client.end();
}
