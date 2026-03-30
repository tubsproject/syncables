import { writeFile } from 'fs/promises';
import { mkdirp } from 'mkdirp';
import { rimraf } from 'rimraf';
import { OpenAPIV3_1 } from '@scalar/openapi-types';

export const DATA_DIR = '.data';

export type TypedObject = {
  data: object | object[];
  schema: OpenAPIV3_1.SchemaObject;
};

const dataDirExistenceChecked: {
  [apiName: string]: boolean;
} = {};
const ensureDataDirExists = async (apiName: string): Promise<void> => {
  if (dataDirExistenceChecked[apiName]) return;
  await mkdirp(`${DATA_DIR}/${apiName}`);
  dataDirExistenceChecked[apiName] = true;
};

export async function storeData(
  apiName: string,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typedData: TypedObject,
): Promise<void> {
  const fileName = `${DATA_DIR}/${apiName}/${path.replace(/\//g, '_')}.json`;
  await ensureDataDirExists(apiName);
  await writeFile(fileName, JSON.stringify(typedData, null, 2));
}

export async function resetStore(apiName: string): Promise<void> {
  await rimraf(`${DATA_DIR}/${apiName}`);
  await mkdirp(`${DATA_DIR}/${apiName}`);
}
