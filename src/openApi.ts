/* eslint @typescript-eslint/no-explicit-any: 0 */
import { readFile } from 'fs';
import { parse } from 'yaml';

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

export function getSpec(specFile: string): Promise<any> {
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
};