import { getSpec } from './openApi.js';
import { createSqlTable, insertData, closeClient } from './db.js';
import { fetchData } from './client.js';
// import { runOAuthClient } from './oauth.js';

// FIXME: use https://github.com/openapi-ts/openapi-typescript here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createCollections(openApiSpec: any, token: string): Promise<void> {
  await Promise.all(Object.keys(openApiSpec.syncables).map(async (syncableName) => {
    console.log(
      `Creating syncable ${openApiSpec.syncables[syncableName].type}: ${syncableName}`,
    );
    if (openApiSpec.syncables[syncableName].get !== undefined) {
      await createSqlTable(
        openApiSpec,
        openApiSpec.syncables[syncableName].get.path,
        openApiSpec.syncables[syncableName].get.field,
      );
      const data = await fetchData(
        openApiSpec,
        openApiSpec.syncables[syncableName].get.path,
        token,
      );
      await insertData(data[openApiSpec.syncables[syncableName].get.field]);
    } else if (openApiSpec.syncables[syncableName].hydra !== undefined) {
      await createSqlTable(
        openApiSpec,
        openApiSpec.syncables[syncableName].hydra,
        'hydra:member',
      );
      const data = await fetchData(
        openApiSpec,
        openApiSpec.syncables[syncableName].hydra,
        token,
      );
      await insertData(data['hydra:member'], [
        '@id',
        '@type',
        'uuid',
        'direction',
        'format',
        'number',
        'date',
        'createdAt'
      ]);
    }

    await closeClient();

  }));
}

// ...
// const openApiSpec = await getSpec('google-calendar-generated.yaml');
// const oauth2Config = {
//   authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
//   tokenURL: 'https://oauth2.googleapis.com/token',
//   clientID: process.env.GOOGLE_CLIENT_ID || 'your-client-id.apps.googleusercontent.com',
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'shhh-its-a-secret',
//   callbackURL: 'http://localhost:8000/callback'
// };
// runOAuthClient(oauth2Config, 8000, async (token) => {
//   console.log(`Received OAuth token: ${token}`);
//   await createCollections(openApiSpec, token);
//   console.log('Data fetched and inserted successfully.');
// }); // Start the OAuth client on port 8000

const openApiSpec2 = await getSpec('acube-peppol-generated.yaml');
await createCollections(openApiSpec2, process.env.ACUBE_TOKEN);