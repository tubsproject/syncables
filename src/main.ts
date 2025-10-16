import { getSpec } from './openApi.js';
import { getPostgresClient, createSqlTable, getFields, Client } from './db.js';
import { insertData } from './devonian.js';
import { fetchData } from './client.js';
// import { runOAuthClient } from './oauth.js';

export class Syncable {
  collectionName: string
  specFilename: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  specObject: { syncables: { [key: string]: any } } | undefined
  authHeaders: { [key: string]: string }
  client: Client
  constructor(collectionName: string, specFilename: string, authHeaders: { [key: string]: string }, client: Client) {
    this.collectionName = collectionName;
    this.specFilename = specFilename;
    this.authHeaders = authHeaders;
    this.client = client;
  }
  async init(): Promise<void> {
    this.specObject = await getSpec(this.specFilename);
  }
  async run(): Promise<void> {
    await Promise.all(Object.keys(this.specObject.syncables).map(async (syncableName) => {
      const tableName = `${this.collectionName}_${syncableName}`;
      console.log(
        `Creating syncable ${this.specObject.syncables[syncableName].type}: ${syncableName} as ${tableName}`,
      );
      const endPoint = this.specObject.syncables[syncableName].get?.path || this.specObject.syncables[syncableName].hydra;
      if (this.specObject.syncables[syncableName].get !== undefined) {
        const fields = getFields(this.specObject, endPoint, this.specObject.syncables[syncableName].get.field);
        await createSqlTable(
          this.client,
          tableName,
          fields,
        );
        const data = await fetchData(
          this.specObject,
          endPoint,
          this.authHeaders,
        );
        await insertData(
          this.client,
          tableName,
          data[this.specObject.syncables[syncableName].get.field],
          Object.keys(fields).filter(x => ['string', 'integer', /*'boolean'*/ ].includes(fields[x].type)));
      } else if (this.specObject.syncables[syncableName].hydra !== undefined) {
        const fields = getFields(this.specObject, endPoint, 'hydra:member');
        fields['@context'] = { type: 'string' };
        await createSqlTable(
          this.client,
          tableName,
          fields,
        );
        const data = await fetchData(
          this.specObject,
          endPoint,
          this.authHeaders,
        );
        await insertData(this.client, tableName, data['hydra:member'], Object.keys(fields).filter(x => ['string', 'integer', /*'boolean'*/].includes(fields[x].type)));
      }
    }));
  }
}

async function createCollections(collectionName: string, client: Client): Promise<void> {
  const openApiSpecFilename = `${collectionName}-generated.yaml`;
  const authHeaders: { [key: string]: string } = {
    [process.env[`${collectionName.toUpperCase().replace('-', '_')}_AUTH_HEADER_NAME`]]: process.env[`${collectionName.toUpperCase()}_AUTH_HEADER_VALUE`],
  };
  const syncable = new Syncable(collectionName, openApiSpecFilename, authHeaders, client);
  await syncable.init();
  await syncable.run();
}

// ...
// runOAuthClient({
//   authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
//   tokenURL: 'https://oauth2.googleapis.com/token',
//   clientID: process.env.GOOGLE_CLIENT_ID || ((): void => { throw new Error('GOOGLE_CLIENT_ID not set') })(),
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET || ((): void => { throw new Error('GOOGLE_CLIENT_SECRET not set') })(),
//   callbackURL: 'http://localhost:8000/callback'
// }, 8000, async (token) => {
//   console.log(`Received OAuth token: ${token}`);
// }); // Start the OAuth client on port 8000
// console.log('Data fetched and inserted. Visit http://localhost:8000/ if you need to renew the GOOGLE_OAUTH_TOKEN env var.');

async function run(): Promise<void> {
  const client = await getPostgresClient();
  // get list of backend platforms from env vars
  const platformsList = Object.keys(process.env).filter(x => x.endsWith('_AUTH_HEADER_NAME')).map(x => x.substring(0, x.length-'_AUTH_HEADER_NAME'.length).toLowerCase().replace('_', '-'));
  console.log('Platforms to sync:', platformsList);
  await Promise.all(platformsList.map((platform) => createCollections(platform, client)));  
  await client.end();
}

// ...
run();