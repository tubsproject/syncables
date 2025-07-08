/* eslint @typescript-eslint/no-explicit-any: 0 */
import { readFile } from 'fs';
import { parse } from 'yaml';
import { Client } from 'pg';

async function getPostgresClient(): Promise<Client> {
  const client = new Client({
    user: process.env.POSTGRES_APP_USER || 'syncables',
    password: process.env.POSTGRES_APP_PASSWORD || 'syncables',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_APP_DB || 'syncables',
  }); 
  await client.connect();
  return client;
}

function resolveInSpec(spec: any, refPath: string, component: any): any {
  // console.log(`Comparing: ${refPath}`, spec?.$ref);
  if (spec?.$ref === refPath) {
    // console.log(`Resolving reference: ${refPath}`);
    spec = component;
    // console.log(`Resolved to:`, spec);
  } else if (typeof spec === 'object') {
    // console.log(`Checking object for reference: ${refPath}`);
    Object.keys(spec).forEach((key) => {
      // console.log(`Checking key: ${key}`);
      spec[key] = resolveInSpec(spec[key], refPath, component);
    });
  }
  return spec;
}

/**
 * Resolves all components in the OpenAPI spec.
 * @param spec The OpenAPI specification object.
 * @returns The modified spec with resolved components.
 */
function resolveComponents(spec: any): any {
  Object.keys(spec.components).forEach((componentType: string) => {
    // console.log(`Resolving components of type: ${componentType}`);
    Object.keys(spec.components[componentType]).forEach(
      (componentName: string) => {
        // console.log(`Resolving component: ${componentType}/${componentName}`);
        spec = resolveInSpec(
          spec,
          `#/components/${componentType}/${componentName}`,
          spec.components[componentType][componentName],
        );
        // console.log(`Spec after resolving component ${componentType}/${componentName}:`, JSON.stringify(spec, null, 2));
      },
    );
  });
  delete spec.components; // Remove components after resolving
  return spec;
}

function getSpec(specFile: string): Promise<any> {
  return new Promise((resolve) => {
    readFile(specFile, function (err, data) {
      if (err) {
        throw err;
      }
      let openApiSpec;
      try {
        openApiSpec = parse(data.toString());
      } catch (parseErr) {
        console.error('Failed to parse YAML:', parseErr.message);
        return;
      }
      if (!openApiSpec.paths) {
        console.error('No "paths" property found in YAML.');
        return;
      }
      openApiSpec = resolveComponents(openApiSpec);
      console.log(`Resolved components in OpenAPI spec.`);
      resolve(openApiSpec);
    });
  });
}

async function createSqlTable(
  openApiSpec: any,
  endPoint: string,
  rowsFrom: string,
): Promise<void> {
  const schema =
    openApiSpec.paths[endPoint]?.get?.responses?.['200']?.content?.[
      'application/json'
    ]?.schema;
  // console.log(`Schema for ${endPoint}:`, JSON.stringify(schema, null, 2));
  const whatWeWant = schema?.properties?.[rowsFrom].items?.properties;
  // console.log(`What we want:`, JSON.stringify(whatWeWant, null, 2));
  const rowSpecs = [];
  Object.entries(whatWeWant).forEach(([key, value]) => {
    if (key === 'primary') {
      key = 'primary_';
    }
    const type = (value as { type: string }).type;
    if (type === 'string') {
      rowSpecs.push(`${key} TEXT`);
    } else if (type === 'integer') {
      rowSpecs.push(`${key} INTEGER`);
    } else if (type === 'boolean') {
      rowSpecs.push(`${key} BOOLEAN`);
    }
  });
  const createTableQuery = `
CREATE TABLE data(
  ${rowSpecs.join(',\n  ')}\n
);
`;
  console.log(createTableQuery);
  const client = await getPostgresClient();
  await client.query(createTableQuery);
  await client.end()

  // Execute SQL statements from strings.
  // const database = new sqlite.Database(':memory:');
  // database.serialize(() => {
  //   database.run(createTableQuery);
  // });
}

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
