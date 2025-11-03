/* eslint @typescript-eslint/no-explicit-any: 0 */
import { readFile } from 'fs';
import { parse } from 'yaml';

function resolveRefs(obj: any, root: any = obj, refDepth = 0): any {
  if (refDepth > 10) {
    console.log('Maximum $ref resolution depth exceeded');
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => resolveRefs(item, root));
  } else if (obj && typeof obj === 'object') {
    if (obj.$ref && typeof obj.$ref === 'string') {
      const refPath = obj.$ref.replace(/^#\//, '').split('/');
      let refValue = root;
      for (const segment of refPath) {
        refValue = refValue[segment];
        if (refValue === undefined) {
          throw new Error(`Could not resolve reference: ${obj.$ref}`);
        }
      }
      return resolveRefs(refValue, root, refDepth + 1);
    } else {
      const resolvedObj: any = {};
      for (const key of Object.keys(obj)) {
        resolvedObj[key] = resolveRefs(obj[key], root, refDepth);
      }
      return resolvedObj;
    }
  }
  return obj;
}
export function getSpec(specFile: string): Promise<any> {
  return new Promise((resolve) => {
    readFile(specFile, function (err, data) {
      if (err) {
        throw err;
      }
      let openApiSpec;
      if (specFile.endsWith('.json')) {
        try {
          openApiSpec = JSON.parse(data.toString());
        } catch (parseErr) {
          console.error('Failed to parse JSON:', parseErr.message);
          return;
        }
      } else if (specFile.endsWith('.yaml') || specFile.endsWith('.yml')) {
        try {
          openApiSpec = parse(data.toString());
        } catch (parseErr) {
          console.error('Failed to parse YAML:', parseErr.message);
          return;
        }
      } else {
        console.error('Spec file must be .json or .yaml/.yml');
        return;
      }
      if (!openApiSpec.paths) {
        console.error('No "paths" property found in YAML.');
        return;
      }
      openApiSpec = resolveRefs(openApiSpec);
      console.log('Resolved all $ref references in OpenAPI spec?', specFile, JSON.stringify(openApiSpec, null, 2));
      // console.log(`Resolved components in OpenAPI spec.`);
      resolve(openApiSpec);
    });
  });
}
