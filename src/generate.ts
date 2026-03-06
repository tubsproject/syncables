import { readFile, readdir, stat } from 'fs/promises';
import { specStrToObj } from './utils.js';
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
async function processFile(filename: string): Promise<void> {
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
  const paramMap = {
    page: 'pageNumber',
    offset: 'offset',
    limit: 'pageSize',
    'max-results': 'pageSize',
    'next-token': 'token',
    next_page_token: 'token',
    cursor: 'token',
    '@odata.nextLink': 'nextPageLink',
    '_links.next': 'nextPageLink',
    'link.next': 'nextPageLink',
    'links.next': 'nextPageLink',
    'meta.links.next': 'nextPageLink',
    next: 'nextPageLink',
    NextPageLink: 'nextPageLink',
    next_page_url: 'nextPageLink',
    'pagination.next': 'nextPageLink',
  };
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
            let schema = content.schema;
            for (const part of parts) {
              if (schema?.properties?.[part]) {
                schema = schema.properties[part];
              } else {
                schema = null;
                break;
              }
            }
            if (schema) {
              found[paramMap[paramName]] = true;
            }
          });
        });
      } 
      const requestBodies = specObj.paths[path].post.requestBody || {};
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
  }
}

if (process.argv.length !== 3) {
  console.error('Please provide a filename or directory as an argument');
  process.exit(1);
}
const baseDir = process.argv[2];

(async (): Promise<void> => {
  await processFileOrDir(baseDir);
})();
