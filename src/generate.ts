import { readFile, readdir, stat } from 'fs/promises';
import { specStrToObj } from './utils.js';
import { default as path } from 'path';

async function isDirectory(path: string): Promise<boolean> {
  try {
    const statInfo = await stat(path);
    return statInfo.isDirectory();
  } catch (err) {
    console.error(`Error checking if path is a directory: ${err}`);
    return false;
  }
}

async function processDirectory(dir: string): Promise<void> {
  const files = await readdir(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (await isDirectory(fullPath)) {
      await processDirectory(fullPath);
    } else if (file.endsWith('.yaml') || file.endsWith('.yml') || file.endsWith('.json')) {
      await processFile(fullPath);
    }
  }
}
async function processFile(filename: string): Promise<void> {
  console.log(`\nProcessing file: ${filename}`);
  const specStr = await readFile(filename, 'utf-8');
  let specObj;
  try {
    specObj = await specStrToObj(specStr);
  } catch (err) {
    console.error(`Error parsing specification: ${err}`);
    return;
  }
  Object.keys(specObj.paths).forEach((path) => {
    if (specObj.paths[path].get) {
      console.log(`GET ${path}`);
      if (specObj.paths[path].get.parameters) {
        specObj.paths[path].get.parameters.forEach((param) => {
          if (['page', 'maxResults', 'pageToken', 'nextToken', 'syncToken'].includes(param.name)) {
            console.log(`  ${param.name} looks like a pagination parameter`);
          }
        });
      }
      Object.keys(specObj.paths[path].get.responses).forEach((statusCode) => {
        if (statusCode.startsWith('2')) {
          const response = specObj.paths[path].get.responses[statusCode];
          if (response.content) {
            Object.keys(response.content).forEach((contentType) => {
              if (response.content[contentType].schema.type === 'array') {
                console.log(`  Response ${statusCode} returns an array, which may indicate pagination`);
              }
            });
          }
          if (response.headers && response.headers.link) {
            console.log(`  Response ${statusCode} has a Link header, which may indicate pagination`);
            console.log(response.headers.link);
          }
        }
      });
    }
  });
}

const filename = process.argv[2];
if (!filename) {
  console.error('Please provide a filename or directory as an argument');
  process.exit(1);
}

(async (): Promise<void> => {
  if (await isDirectory(filename)) {
    await processDirectory(filename);
  } else {
    await processFile(filename);
  }
})();