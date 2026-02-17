import { readFileSync } from 'fs';
import { mkdirp } from 'mkdirp';
import { Syncer } from './syncer.js';
import { fetchFunction } from './caching-fetch.js';
import { configs } from './configs.js';
import { runOAuthClient } from './oauth.js';

mkdirp.sync('.fetch-cache'); // Ensure the cache directory exists
mkdirp.sync('.tokens'); // Ensure the tokens directory exists

async function getBearerToken(apiName: string): Promise<string> {
  const tokenPath = `.tokens/${apiName}.txt`;
  try {
    const token = await readFileSync(tokenPath, 'utf-8');
    return token.trim();
  } catch (err) {
    console.error(`Error reading token for ${apiName} from ${tokenPath}:`, err);
    if (!configs[apiName]) {
      console.error(`Unsupported API name: ${apiName}`);
      process.exit(1);
    }
    console.log('Starting OAuth flow for', apiName);
    return await runOAuthClient(apiName);
  }
}

const promises = Object.keys(configs).map(async (specName) => {
  const specFilename = `./openapi/generated/${specName}.yaml`;
  const specStr = readFileSync(specFilename).toString();
  const syncer = new Syncer({
    specStr,
    authHeaders: {
      Authorization: `Bearer ${await getBearerToken(specName)}`,
    },
    fetchFunction,
    dbConn:
      'postgresql://syncables:syncables@localhost:5432/syncables?sslmode=disable',
  });

  return await syncer.fullFetch();
});
await Promise.all(promises);
