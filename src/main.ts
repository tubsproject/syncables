import { getSpec } from './openApi.js';
import { closeClient, createSqlTable, getFields } from './db.js';
import { insertData } from './devonian.js';
import { fetchData } from './client.js';
// import { runOAuthClient } from './oauth.js';

async function createCollections(collectionName: string): Promise<void> {
  const openApiSpecFilename = `${collectionName}-generated.yaml`;
  const authHeaders: { [key: string]: string } = {
    [process.env[`${collectionName.toUpperCase().replace('-', '_')}_AUTH_HEADER_NAME`]]: process.env[`${collectionName.toUpperCase()}_AUTH_HEADER_VALUE`],
  };
  console.log(`Creating collections from ${openApiSpecFilename}`);
  const openApiSpec = await getSpec(openApiSpecFilename);
  await Promise.all(Object.keys(openApiSpec.syncables).map(async (syncableName) => {
    const tableName = `${collectionName}_${syncableName}`;
    console.log(
      `Creating syncable ${openApiSpec.syncables[syncableName].type}: ${syncableName} as ${tableName}`,
    );
    const endPoint = openApiSpec.syncables[syncableName].get?.path || openApiSpec.syncables[syncableName].hydra;
    if (openApiSpec.syncables[syncableName].get !== undefined) {
      const fields = getFields(openApiSpec, endPoint, openApiSpec.syncables[syncableName].get.field);
      await createSqlTable(
        tableName,
        fields,
      );
      const data = await fetchData(
        openApiSpec,
        endPoint,
        authHeaders,
      );
      await insertData(tableName, data[openApiSpec.syncables[syncableName].get.field], Object.keys(fields).filter(x => ['string', 'integer', /*'boolean'*/ ].includes(fields[x].type)));
    } else if (openApiSpec.syncables[syncableName].hydra !== undefined) {
      const fields = getFields(openApiSpec, endPoint, 'hydra:member');
      fields['@context'] = { type: 'string' };
      await createSqlTable(
        tableName,
        fields,
      );
      const data = await fetchData(
        openApiSpec,
        openApiSpec.syncables[syncableName].hydra,
        authHeaders,
      );
      await insertData(tableName, data['hydra:member'], Object.keys(fields).filter(x => ['string', 'integer', /*'boolean'*/].includes(fields[x].type)));
    }
  }));
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

// get list of backend platforms from env vars
const platformsList = Object.keys(process.env).filter(x => x.endsWith('_AUTH_HEADER_NAME')).map(x => x.substring(0, x.length-'_AUTH_HEADER_NAME'.length).toLowerCase().replace('_', '-'));
console.log('Platforms to sync:', platformsList);
await Promise.all(platformsList.map((platform) => createCollections(platform)));

closeClient();