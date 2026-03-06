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
// let numDone = 0;
async function processFile(filename: string): Promise<void> {
  // if (numDone++ > 200) {
  //   return;
  // }
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
  const synonyms = {
    pageNumber: ['page'],
    offset: ['offset', 'pagination.rowOffset'],
    pageSize: ['limit', 'pageSize', 'max-results', 'MaxResults', 'maxResults'],
    token: ['next-token', 'next_page_token', 'NextToken', 'cursor', 'nextToken'],
    nextPageLink: ['@odata.nextLink', '_links.next', 'link.next', 'links.next', 'meta.links.next', 'next', 'NextPageLink', 'next_page_url', 'pagination.next'],
  };
  const paramMap = {};
  Object.keys(synonyms).forEach(meaning => {
    synonyms[meaning].forEach(namePath => {
      paramMap[namePath] = meaning;
    });
  });

  Object.keys(specObj.paths).forEach((path) => {
    if (specObj.paths[path].get) {
      // console.log(`GET ${path}`);
      if (specObj.paths[path].get.parameters) {
        specObj.paths[path].get.parameters.forEach(parameter => {
          Object.keys(paramMap).forEach((paramName) => {
            if (parameter.name === paramName) {
              found[paramMap[paramName]] = true;
            }
          });
        });
      }
      const responses = specObj.paths[path].get.responses || {};
      Object.keys(responses).forEach((responseCode) => {
        // console.log('considering', responseCode, responses);
        const response = responses[responseCode];
        Object.keys(response.content || {}).forEach((contentType) => {
          const content = response.content[contentType];
          // console.log('considering content', path, contentType, content);
          if (content.schema?.cursor) {
            found['pageToken'] = true;
          }
        });
      });
    }
    if (specObj.paths[path].post) {
      // console.log(`POST ${path}`);
      if (specObj.paths[path].post.parameters) {
        specObj.paths[path].post.parameters.forEach(parameter => {
          Object.keys(paramMap).forEach((paramName) => {
            if (parameter.name === paramName) {
              found[paramMap[paramName]] = true;
            }
          });
        });
      }
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
      const requestBodies = specObj.paths[path].post.requestBody?.content || {};
      // console.log('checking request bodies', path, requestBodies);
      checkContent(requestBodies);

      const responses = specObj.paths[path].post.responses || {};
      Object.keys(responses).forEach((responseCode) => {
        // console.log('considering', responseCode, responses);
        const response = responses[responseCode];
        checkContent(response.content);
      });
    }
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
