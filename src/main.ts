import { getSpec } from './openApi.js';
import { createSqlTable, getFields, insertData } from './db.js';
import { fetchData } from './client.js';
import { runOAuthClient } from './oauth.js';

async function createCollections(openApiSpecFilename: string, authHeaders: { [key: string]: string }): Promise<void> {
  console.log(`Creating collections from ${openApiSpecFilename}`);
  const openApiSpec = await getSpec(openApiSpecFilename);
  await Promise.all(Object.keys(openApiSpec.syncables).map(async (syncableName) => {
    console.log(
      `Creating syncable ${openApiSpec.syncables[syncableName].type}: ${syncableName}`,
    );
    const endPoint = openApiSpec.syncables[syncableName].get?.path || openApiSpec.syncables[syncableName].hydra;
    if (openApiSpec.syncables[syncableName].get !== undefined) {
      const fields = getFields(openApiSpec, endPoint, openApiSpec.syncables[syncableName].get.field);
      await createSqlTable(
        syncableName,
        fields,
      );
      const data = await fetchData(
        openApiSpec,
        endPoint,
        authHeaders,
      );
      await insertData(syncableName, data[openApiSpec.syncables[syncableName].get.field], Object.keys(fields).filter(x => ['string', 'integer', /*'boolean'*/ ].includes(fields[x].type)));
    } else if (openApiSpec.syncables[syncableName].hydra !== undefined) {
      const fields = getFields(openApiSpec, endPoint, 'hydra:member');
      fields['@context'] = { type: 'string' };
      await createSqlTable(
        syncableName,
        fields,
      );
      const data = await fetchData(
        openApiSpec,
        openApiSpec.syncables[syncableName].hydra,
        authHeaders,
      );
      await insertData(syncableName, data['hydra:member'], Object.keys(fields).filter(x => ['string', 'integer', 'boolean'].includes(fields[x].type)));
    }
  }));
}

// ...
const oauth2Config = {
  authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenURL: 'https://oauth2.googleapis.com/token',
  clientID: process.env.GOOGLE_CLIENT_ID || ((): void => { throw new Error('GOOGLE_CLIENT_ID not set') })(),
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || ((): void => { throw new Error('GOOGLE_CLIENT_SECRET not set') })(),
  callbackURL: 'http://localhost:8000/callback'
};
runOAuthClient(oauth2Config, 8000, async (token) => {
  console.log(`Received OAuth token: ${token}`);
}); // Start the OAuth client on port 8000

await createCollections('acube-peppol-generated.yaml', { 'Authorization': `Bearer ${process.env.ACUBE_TOKEN }` });
// await createCollections('peppyrus-peppol-generated.yaml', { 'X-Api-Key': process.env.PEPPYRUS_TOKEN_TEST });
// await createCollections('ion-peppol-generated.yaml', { Authorization: `Token ${process.env.ION_API_KEY}` });
// await createCollections('google-calendar-generated.yaml', { Authorization: `Bearer ${process.env.GOOGLE_OAUTH_TOKEN}`, 'X-Referer': 'https://explorer.apis.google.com' });

console.log('Data fetched and inserted. Visit http://localhost:8000/ if you need to renew the GOOGLE_OAUTH_TOKEN env var.');
