import { getSpec } from './openApi.js';
import { createSqlTable, getFields, insertData } from './db.js';
import { fetchData } from './client.js';
// import { runOAuthClient } from './oauth.js';

// FIXME: use https://github.com/openapi-ts/openapi-typescript here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createCollections(openApiSpec: any, token: string): Promise<void> {
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
        token,
      );
      await insertData(syncableName, data[openApiSpec.syncables[syncableName].get.field], Object.keys(fields).filter(x => ['string', 'integer', 'boolean'].includes(fields[x].type)));
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
        token,
      );
      await insertData(syncableName, data['hydra:member'], Object.keys(fields).filter(x => ['string', 'integer', 'boolean'].includes(fields[x].type)));
    }
  }));
}

// ...
// const openApiSpec = await getSpec('google-calendar-generated.yaml');
// const oauth2Config = {
//   authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
//   tokenURL: 'https://oauth2.googleapis.com/token',
//   clientID: process.env.GOOGLE_CLIENT_ID || ((): void => { throw new Error('GOOGLE_CLIENT_ID not set') })(),
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET || ((): void => { throw new Error('GOOGLE_CLIENT_SECRET not set') })(),
//   callbackURL: 'http://localhost:8000/callback'
// };
// runOAuthClient(oauth2Config, 8000, async (token) => {
//   console.log(`Received OAuth token: ${token}`);
//   await createCollections(openApiSpec, token);
//   console.log('Data fetched and inserted successfully.');
// }); // Start the OAuth client on port 8000

const openApiSpecAcube = await getSpec('acube-peppol-generated.yaml');
await createCollections(openApiSpecAcube, process.env.ACUBE_TOKEN);

const openApiSpecPeppyrus = await getSpec('peppyrus-peppol-generated.yaml');
await createCollections(openApiSpecPeppyrus, process.env.PEPPYRUS_TOKEN);