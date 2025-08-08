import { getSpec } from './openApi.js';
import { createSqlTable, insertData, closeClient } from './db.js';
import { fetchData } from './client.js';
import { runOAuthClient } from './oauth.js';

async function createCollections(specFile: string, token: string): Promise<void> {
  const openApiSpec = await getSpec(specFile);
  await Promise.all(Object.keys(openApiSpec.syncables).map(async (syncableName) => {
    console.log(
      `Creating syncable ${openApiSpec.syncables[syncableName].type}: ${syncableName}`,
    );
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
    await insertData(data);
    await closeClient();

  }));
}

// ...
runOAuthClient(8000, async (token) => {
  console.log(`Received OAuth token: ${token}`);
  await createCollections('generated.yaml', token);
  console.log('Data fetched and inserted successfully.');
}); // Start the OAuth client on port 8000