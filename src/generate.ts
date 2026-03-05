import { readFile, readdir, stat } from 'fs/promises';
import { specStrToObj } from './utils.js';
import { default as path } from 'path';

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
    } else if (filePath.endsWith('.yaml') || filePath.endsWith('.yml') || filePath.endsWith('.json')) {
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
    console.error(`Error parsing specification: ${err}`);
    return;
  }
  const found = {};
  Object.keys(specObj.paths).forEach((path) => {
    if (specObj.paths[path].get) {
      // console.log(`GET ${path}`);
      if (specObj.paths[path].get.parameters) {
        specObj.paths[path].get.parameters.forEach((param) => {
          if (['page', 'maxResults', 'pageToken', 'nextToken', 'syncToken', 'offset', 'limit'].includes(param.name)) {
            found[param.name] = true;
          }
        });
      }
      // Object.keys(specObj.paths[path].get.responses).forEach((statusCode) => {
      //   if (statusCode.startsWith('2')) {
      //     const response = specObj.paths[path].get.responses[statusCode];
      //     if (response.content) {
      //       Object.keys(response.content).forEach((contentType) => {
      //         if (response.content[contentType].schema.type === 'array') {
      //           console.log(`  Response ${statusCode} returns an array, which may indicate pagination`);
      //         }
      //       });
      //     }
      //     if (response.headers && response.headers.link) {
      //       console.log(`  Response ${statusCode} has a Link header, which may indicate pagination`);
      //       console.log(response.headers.link);
      //     }
      //   }
      // });
    }
  });
  if (Object.keys(found).length > 0) {
    console.log(`${filename}: some GET endpoints have pagination parameters: ${Object.keys(found).join(', ')}`);
  }
}

const baseDir = process.argv[2];
if (!baseDir) {
  console.error('Please provide a filename or directory as an argument');
  process.exit(1);
}

(async (): Promise<void> => {
    await processFileOrDir(baseDir);
})();
