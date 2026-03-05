import { readFile } from 'fs/promises';
import { fetchFunction } from './caching-fetch.js';
import { applyOverlay } from 'openapi-overlays-js/src/overlay.js';
import { dereference } from '@readme/openapi-parser';
import { parse } from 'yaml';
import { OpenAPIV3_1 } from '@scalar/openapi-types';

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
  type: 'overlay' | 'integrationTest',
  apiName: string,
): Promise<string> {
  const dir =
    type === 'integrationTest'
      ? `./__tests__/integration/overlay`
      : `./openapi/overlay`;
  const filenameBase = `${dir}/${apiName}${type === 'overlay' ? '-overlay' : ''}`;
  console.log('readSpec', type, apiName, filenameBase);
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
export async function parseSpecStr(
  specStr: string,
): Promise<OpenAPIV3_1.Document> {
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
): Promise<OpenAPIV3_1.Document> {
  const specObj: OpenAPIV3_1.Document = await parseSpecStr(specStr);
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
    // console.log('parsed overlay object', JSON.stringify(overlayObj, null, 2));
    applyOverlay(specObj, overlayObj);
  }
  // console.log('starting dereference of spec');
  // console.log(Object.keys(specObj.components?.schemas));
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

export async function getSpecFromOverlay(overlayStr: string): Promise<string> {
  const overlayObj = await parseSpecStr(overlayStr);
  if (typeof overlayObj !== 'object' || overlayObj === null) {
    throw new Error(`Overlay is not a valid object`);
  }
  if (
    typeof overlayObj.openapi !== 'string' ||
    !overlayObj.openapi.startsWith('3.')
  ) {
    throw new Error(`Overlay is not a valid OpenAPI 3.x document`);
  }
  const specUrl = (overlayObj as OpenAPIV3_1.Document & { extends: string })
    .extends;
  if (typeof specUrl !== 'string') {
    throw new Error(`Overlay does not have a valid extends URL`);
  }
  console.log(`Fetching base spec from ${specUrl}`);
  const fetchResult = await fetchFunction(specUrl);
  if (!fetchResult.ok) {
    throw new Error(
      `Failed to fetch base spec from ${specUrl}: ${fetchResult.status} ${fetchResult.statusText}`,
    );
  }
  const specStr = await fetchResult.text();
  console.log(`Fetched base spec, now processing overlay`);
  return specStr;
}
