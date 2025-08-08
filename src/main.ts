import { getSpec } from './openApi.js';
import { createSqlTable } from './db.js';

async function createCollections(specFile: string): Promise<void> {
  const openApiSpec = await getSpec(specFile);
  await Promise.all(Object.keys(openApiSpec.syncables).map((syncableName) => {
    console.log(
      `Creating syncable ${openApiSpec.syncables[syncableName].type}: ${syncableName}`,
    );
    return  createSqlTable(
      openApiSpec,
      openApiSpec.syncables[syncableName].get.path,
      openApiSpec.syncables[syncableName].get.field,
    );
  }));
}

// ...
await createCollections('generated.yaml');
