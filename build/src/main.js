/* eslint @typescript-eslint/no-explicit-any: 0 */
import { readFile } from 'fs';
import { parse } from 'yaml';
function resolveInSpec(spec, refPath, component) {
    // console.log(`Comparing: ${refPath}`, spec?.$ref);
    if (spec?.$ref === refPath) {
        // console.log(`Resolving reference: ${refPath}`);
        spec = component;
        // console.log(`Resolved to:`, spec);
    }
    else if (typeof spec === 'object') {
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
function resolveComponents(spec) {
    Object.keys(spec.components).forEach((componentType) => {
        // console.log(`Resolving components of type: ${componentType}`);
        Object.keys(spec.components[componentType]).forEach((componentName) => {
            // console.log(`Resolving component: ${componentType}/${componentName}`);
            spec = resolveInSpec(spec, `#/components/${componentType}/${componentName}`, spec.components[componentType][componentName]);
            // console.log(`Spec after resolving component ${componentType}/${componentName}:`, JSON.stringify(spec, null, 2));
        });
    });
    delete spec.components; // Remove components after resolving
    return spec;
}
function getSpec(specFile) {
    return new Promise((resolve) => {
        readFile(specFile, function (err, data) {
            if (err) {
                throw err;
            }
            let openApiSpec;
            try {
                openApiSpec = parse(data.toString());
            }
            catch (parseErr) {
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
function createSqlTable(openApiSpec, endPoint, rowsFrom) {
    const schema = openApiSpec.paths[endPoint]?.get?.responses?.['200']?.content?.['application/json']?.schema;
    // console.log(`Schema for ${endPoint}:`, JSON.stringify(schema, null, 2));
    const whatWeWant = schema?.properties?.[rowsFrom].items?.properties;
    // console.log(`What we want:`, JSON.stringify(whatWeWant, null, 2));
    const rowSpecs = (whatWeWant ? Object.entries(whatWeWant).map(([key, value]) => {
        const type = value.type;
        if (type === 'string') {
            return `${key} TEXT,`;
        }
        else if (type === 'integer') {
            return `${key} INTEGER,`;
        }
        else if (type === 'boolean') {
            return `${key} BOOLEAN,`;
        }
        else
            return '';
    }) : []);
    const createTableQuery = `
CREATE TABLE data(
  ${rowSpecs.join('\n  ')}
) STRICT
  `;
    console.log(createTableQuery);
    // Execute SQL statements from strings.
    // const database = new sqlite.Database(':memory:');
    // database.serialize(() => {
    //   database.run(createTableQuery);
    // });
}
async function createCollections(specFile) {
    const openApiSpec = await getSpec(specFile);
    Object.keys(openApiSpec.collections).forEach((collectionName) => {
        console.log(`Creating collection: ${collectionName}`);
        createSqlTable(openApiSpec, openApiSpec.collections[collectionName].get.path, openApiSpec.collections[collectionName].get.field);
    });
}
// ...
await createCollections('./google-calendar-overlayed-with-collections.yaml');
//# sourceMappingURL=main.js.map