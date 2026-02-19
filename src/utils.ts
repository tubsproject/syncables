import { readFile } from 'fs/promises';

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
