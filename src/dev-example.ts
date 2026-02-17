import { readFileSync } from 'fs';
import { Syncer } from './syncer.js';
import { fetchFunction } from './caching-fetch.js';

const authHeaders = {
  'google-calendar': {
    Authorization: `Bearer ${process.env.GOOGLE_BEARER_TOKEN}`,
  },
};

const promises = Object.keys(authHeaders).map(async (specName) => {
  const specFilename = `./openapi/generated/${specName}.yaml`;
  const specStr = readFileSync(specFilename).toString();
  const syncer = new Syncer({
    specStr,
    authHeaders: authHeaders[specName],
    fetchFunction,
    dbConn:
      'postgresql://syncables:syncables@localhost:5432/syncables?sslmode=disable',
  });

  return await syncer.fullFetch();
});
await Promise.all(promises);
