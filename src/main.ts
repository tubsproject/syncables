import { getSpec } from './openApi.js';
import { createSqlTable, insertData } from './db.js';
import { fetchData } from './client.js';
import { runOAuthClient } from './oauth.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createTables(openApiSpec: any): Promise<void> {
  await Promise.all(Object.keys(openApiSpec.syncables).map(async (syncableName) => {
    console.log(
      `Creating syncable ${openApiSpec.syncables[syncableName].type}: ${syncableName}`,
    );
    await createSqlTable(
      openApiSpec,
      openApiSpec.syncables[syncableName].get.path,
      openApiSpec.syncables[syncableName].get.field,
    );
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchCollections(openApiSpec: any, token: string): Promise<void> {
  await Promise.all(Object.keys(openApiSpec.syncables).map(async (syncableName) => {
    console.log(
      `Fetching syncable ${openApiSpec.syncables[syncableName].type}: ${syncableName}`,
    );
    const data = await fetchData(
      openApiSpec,
      openApiSpec.syncables[syncableName].get.path,
      token,
    );
    await insertData(data);
  }));
}

// ...
const openApiSpec = await getSpec('generated.yaml');
const oauth2Config = {
  authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenURL: 'https://oauth2.googleapis.com/token',
  clientID: process.env.GOOGLE_CLIENT_ID || 'your-client-id.apps.googleusercontent.com',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'shhh-its-a-secret',
  callbackURL: 'http://localhost:8000/callback'
};
await createTables(openApiSpec);
runOAuthClient(oauth2Config, 8000, async (token) => {
  console.log(`Received OAuth token: ${token}`);
  await fetchCollections(openApiSpec, token);
  console.log('Data fetched and inserted successfully.');
}); // Start the OAuth client on port 8000