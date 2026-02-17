import { readFile } from 'fs/promises';
import { mkdirp } from 'mkdirp';
import { Syncer } from './syncer.js';
import { fetchFunction } from './caching-fetch.js';
import { configs } from './configs.js';
import { runOAuthClient } from './oauth.js';

mkdirp.sync('.fetch-cache'); // Ensure the cache directory exists
mkdirp.sync('.tokens'); // Ensure the tokens directory exists

async function getBearerTokens(
  apiNames: string[],
): Promise<{ [apiName: string]: string }> {
  const tokens: { [apiName: string]: string } = {};
  for (const apiName of apiNames) {
    console.log(`Checking for existing token for ${apiName}...`);
    const tokenPath = `.tokens/${apiName}.txt`;
    try {
      const token = await readFile(tokenPath, 'utf-8');
      tokens[apiName] = token.trim();
    } catch (err) {
      void err;
      console.error(
        `File ${tokenPath} not found, initiating OAuth flow for ${apiName}`,
      );
      console.log('Starting OAuth flow for', apiName);
      tokens[apiName] = await runOAuthClient(apiName);
      console.log('Completed OAuth flow for', apiName);
      if (!configs[apiName]) {
        console.error(`Unsupported API name: ${apiName}`);
        process.exit(1);
      }
    }
  }
  console.log('Obtained bearer tokens for all APIs');
  return tokens;
}

const bearerTokens = await getBearerTokens(Object.keys(configs));
const promises = Object.keys(configs).map(async (specName) => {
  const specFilename = `./openapi/generated/${specName}.yaml`;
  const specStr = (await readFile(specFilename)).toString();
  const syncer = new Syncer({
    specStr,
    authHeaders: {
      Authorization: `Bearer ${bearerTokens[specName]}`,
    },
    fetchFunction,
    dbConn:
      'postgresql://syncables:syncables@localhost:5432/syncables?sslmode=disable',
  });
  // void syncer;
  return await syncer.fullFetch();
});
await Promise.all(promises);
