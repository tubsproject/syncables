import { readFile } from 'fs/promises';
import { applyOverlay } from 'openapi-overlays-js/src/overlay.js';
import { dereference } from '@readme/openapi-parser';
import { parse } from 'yaml';
import { OpenAPIV3 } from '@scalar/openapi-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getObjectPath(obj: object, path?: string[]): any {
  //   console.log('getObjectPath', path, obj);
  if (path === undefined) {
    return obj;
  }
  if (!Array.isArray(path) || path.length === 0) {
    throw new Error(`Path must be a non-empty array of strings`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pointer: any = obj;
  for (let i = 0; i < path.length; i++) {
    const part = path[i];
    if (pointer && typeof pointer === 'object' && part in pointer) {
      pointer = pointer[part];
    } else {
      throw new Error(`Path not found: ${path.slice(0, i + 1).join('.')}`);
    }
  }
  return pointer;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setObjectPath(obj: object, path: string[], value: any): object {
  if (path === undefined) {
    // console.log('no path provided, returning value as object');
    return value;
  }
  if (!Array.isArray(path) || path.length === 0) {
    throw new Error(`Path must be a non-empty array of strings`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pointer: any = obj;
  for (let i = 0; i < path.length; i++) {
    const part = path[i];
    if (i === path.length - 1) {
      // Last part, set the value
      if (pointer && typeof pointer === 'object') {
        pointer[part] = value;
      }
    } else {
      // Traverse down the object
      if (pointer && typeof pointer === 'object' && part in pointer) {
        pointer = pointer[part];
      } else {
        pointer = null;
      }
    }
  }
  return obj;
}

export async function readSpec(
  type: 'spec' | 'overlay',
  apiName: string,
): Promise<string> {
  const filenameBase = `./openapi/${type === 'spec' ? 'oad' : 'overlay'}/${apiName}${
    type === 'overlay' ? '-overlay' : ''
  }`;
  try {
    return await readFile(`${filenameBase}.yaml`, 'utf-8');
  } catch (err1) {
    void err1;
    try {
      return await readFile(`${filenameBase}.json`, 'utf-8');
    } catch (err2) {
      void err2;
      throw new Error(
        `Error reading ${type} file for ${apiName} (both ${filenameBase}.yaml and .json)`,
      );
    }
  }
}
export async function parseSpecStr(specStr: string): Promise<object> {
  let specObj;
  try {
    specObj = parse(specStr);
  } catch (err1) {
    try {
      specObj = JSON.parse(specStr);
    } catch (err2) {
      throw new Error(
        `Spec is not valid JSON or YAML: ${err1.message} / ${err2.message}`,
      );
    }
  }
  return specObj;
}
export async function specStrToObj(
  specStr: string,
  overlayStr: string | null = null,
): Promise<OpenAPIV3.Document> {
  const specObj: OpenAPIV3.Document = await parseSpecStr(specStr);
  if (typeof specObj !== 'object' || specObj === null) {
    throw new Error('Spec is not a valid object');
  }
  if (
    typeof specObj.openapi !== 'string' ||
    !specObj.openapi.startsWith('3.')
  ) {
    throw new Error('Spec is not a valid OpenAPI 3.x document');
  }
  if (typeof specObj.paths !== 'object' || specObj.paths === null) {
    throw new Error('Spec does not have valid paths');
  }
  if (typeof specObj.components !== 'object' || specObj.components === null) {
    throw new Error('Spec does not have valid components');
  }
  if (overlayStr) {
    const overlayObj = await parseSpecStr(overlayStr);
    console.log('parsed overlay object', JSON.stringify(overlayObj, null, 2));
    applyOverlay(specObj, overlayObj);
  }
  console.log('starting dereference of spec');
  console.log(Object.keys(specObj.components?.schemas));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dereferenced = await dereference(specObj as any);
  if (typeof dereferenced !== 'object' || dereferenced === null) {
    throw new Error('Dereferenced spec is not a valid object');
  }
  if (
    typeof dereferenced.components !== 'object' ||
    dereferenced.components === null
  ) {
    throw new Error('Dereferenced spec does not have valid components');
  }
  return dereferenced;
}
