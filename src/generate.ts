import { readFile, readdir, stat, writeFile } from 'fs/promises';
import { specStrToObj, findPathParts } from './utils.js';
import { default as path } from 'path';
import { OpenAPIV3_1 } from '@scalar/openapi-types';

// For all API endpoints that have offset and limit parameters, generate the following overlay:
// openapi: 3.0.0
// extends: ...
// actions:
// - target: components
//   update:
//     paginationSchemes:
//       paginate: ...
//       offset:
//         parameter: offset
//       pageSize:
//         parameter: limit
// my target is to get my own real personal data synced from many APIs
// so I should refactor the code in this repo to use paginationSchemes

const manuallyChecked: { [filename: string]: boolean } = {};
async function manualCheck(filename: string): Promise<void> {
  if (manuallyChecked[filename] === undefined) {
    manuallyChecked[filename] = false;
  }
}
async function isDirectory(path: string): Promise<boolean> {
  try {
    const statInfo = await stat(path);
    return statInfo.isDirectory();
  } catch (err) {
    console.error(`Error checking if path is a directory: ${err}`);
    return false;
  }
}

async function processFileOrDir(filePath: string): Promise<void> {
  if (await isDirectory(filePath)) {
    const files = await readdir(filePath);
    for (const file of files) {
      const fullPath = path.join(filePath, file);
      await processFileOrDir(fullPath);
    }
  } else if (
    filePath.endsWith('.yaml') ||
    filePath.endsWith('.yml') ||
    filePath.endsWith('.json')
  ) {
    await processFile(filePath);
  }
}
// paginationSchemes
// if: parameter
// name: NextToken
// useAs: pagination-token
//
// if: link-response-header
// rel: next
// useAs: next-link
//
//
// ifParameter: page
// useAs: page-number
//
// ifParameter
// page:
//   in: query
//   name: page
// offset:
//   in: query
//   name: offset
// cursor:
//   - token
//      in: query
//      name: pageToken
//      inResult:
//        - pagination
//        - nextPageToken
//   - link
//     - rel: next
// confirmation:
// - path
// - method
// skewProtection: unsafe / snapshot
// pageSize:
// - min
// - max
// - default
// - param
// results:
// - records
// sync:
// - Google syncToken
// - MoneyBird synchronization
let numDone = 0;
async function processFile(filename: string): Promise<void> {
  if (numDone++ > 1000) {
    return;
  }
  // if (numDone < 100) {
  //   return;
  // }
  // console.log(`\nProcessing file: ${filename}`);
  const specStr = await readFile(filename, 'utf-8');
  let specObj;
  try {
    specObj = await specStrToObj(specStr);
  } catch (err) {
    console.log(`${filename}: Error parsing specification: ${err}`);
    return;
  }
  const found = {};
  function checkContent(contentTypes: OpenAPIV3_1.MediaTypeObject): void {
    Object.keys(contentTypes || {}).forEach((contentType) => {
      const content = contentTypes[contentType];
      Object.keys(paramMap).forEach((paramName) => {
        const parts = paramName.split('.');
        const schema = content.schema;
        if (findPathParts(parts, schema)) {
          found[paramMap[paramName]] = true;
        }
      });
    });
  } 

  const synonyms = {
    pageNumber: ['page', 'pagination.current_page', 'page[number]'],
    offset: ['offset', 'pagination.rowOffset', '$skip'],
    token: ['next-token', 'next_page_token', 'NextToken', 'cursor', 'nextToken', 'NextMarker'],
    nextPageLink: ['@odata.nextLink', '_links.next', 'link.next', 'links.next', 'meta.links.next', 'next', 'NextPageLink', 'next_page_url', 'pagination.next'],
    pageSize: ['limit', 'pageSize', 'max-results', 'MaxResults', 'maxResults', 'MaxItems', 'pagination.limit', 'page[size]'],
  };
  const paramMap = {};
  Object.keys(synonyms).forEach(meaning => {
    synonyms[meaning].forEach(namePath => {
      paramMap[namePath] = meaning;
    });
  });
  function checkMethod(methodObj: OpenAPIV3_1.OperationObject): void {
    if (methodObj.parameters) {
      methodObj.parameters.forEach(parameter => {
        Object.keys(paramMap).forEach((paramName) => {
          if (parameter.name === paramName) {
            found[paramMap[paramName]] = true;
          }
        });
      });
    }
    const requestBodies = methodObj.requestBody?.content || {};
    checkContent(requestBodies);

    const responses = methodObj.responses || {};
    Object.keys(responses).forEach((responseCode) => {
      const response = responses[responseCode];
      console.log('considering', responseCode, response);
      checkContent(response.content);
      if (response.headers?.Link) {
        found['nextPageLink'] = true;
      }
    });
  }

  Object.keys(specObj.paths).forEach((path) => {
    checkMethod(specObj.paths[path].get);
    checkMethod(specObj.paths[path].post);
  });
  if (Object.keys(found).length > 0) {
    console.log(
      `${filename}: some GET/POST endpoints have pagination parameters: ${Object.keys(found).join(', ')}`,
    );
  } else {
    console.log(`${filename}: no GET/POST endpoints with pagination parameters found`);
    await manualCheck(filename);
  }
}

if (process.argv.length !== 3) {
  console.error('Please provide a filename or directory as an argument');
  process.exit(1);
}
const baseDir = process.argv[2];

(async (): Promise<void> => {
  try {

    const manuallyCheckedLines = await readFile('checked.txt');
    manuallyCheckedLines.toString().split('\n').forEach((line) => {
      if (line.trim() !== '') {
        const [filename, status] = line.split(' ');
        manuallyChecked[filename] = status === 'true';
      }
    });
  } catch (err) {
    void err;
    console.log('checked.txt not found, starting with empty manuallyChecked');
  }
  await processFileOrDir(baseDir);
  await writeFile('checked.txt', Object.keys(manuallyChecked).map(filename => `${filename} ${manuallyChecked[filename]}`).join('\n'));

})();
