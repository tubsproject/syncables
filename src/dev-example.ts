import { readFile, readdir } from 'fs/promises';
import { mkdirp } from 'mkdirp';
import { OpenAPIV3 } from '@scalar/openapi-types';
import { Syncer, specStrToObj } from './syncer.js';
import { fetchFunction } from './caching-fetch.js';
import { authorize } from './oauth.js';

const securitySchemeNames = {
  // acube: 'acube',
  // 'google-calendar': 'Oauth2c',
  'maventa-peppol': 'oauth2',
  // moneybird: 'oauth2',
  // netfly: 'oauth2', this is a nice example of client credentials flow and I think I got the implementation right, but my test account for netfly was deactivated on 19 January 2026
};

async function getBearerTokens(
  apiNames: string[],
  securitySchemeObjects: { [apiName: string]: OpenAPIV3.SecuritySchemeObject },
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
      tokens[apiName] = await authorize(
        apiName,
        securitySchemeObjects[apiName],
      );
      console.log('Completed OAuth flow for', apiName);
    }
  }
  console.log('Obtained bearer tokens for all APIs');
  return tokens;
}

async function main(): Promise<void> {
  await mkdirp('.fetch-cache'); // Ensure the cache directory exists
  await mkdirp('.tokens'); // Ensure the tokens directory exists
  const specFileNames = await readdir('./openapi/oad/');
  const apiNames = specFileNames
    .map((fileName) => fileName.replace('.yaml', ''))
    .filter((name) => {
      console.log('checking name', name, Object.keys(securitySchemeNames));
      return Object.keys(securitySchemeNames).includes(name);
    });
  console.log('Found API specs for:', apiNames);
  const securitySchemeObjects: {
    [apiName: string]: OpenAPIV3.SecuritySchemeObject;
  } = {};

  const specStrs: { [apiName: string]: string } = {};
  const overlayStrs: { [apiName: string]: string } = {};
  await Promise.all(
    apiNames.map(async (apiName: string) => {
      const specFilename = `./openapi/oad/${apiName}.yaml`;
      const overlayFilename = `./openapi/overlay/${apiName}-overlay.yaml`;
      specStrs[apiName] = (await readFile(specFilename, 'utf-8')).toString();
      overlayStrs[apiName] = (
        await readFile(overlayFilename, 'utf-8')
      ).toString();
      const spec: OpenAPIV3.Document = await specStrToObj(
        specStrs[apiName],
        overlayStrs[apiName],
      );
      console.log(Object.keys(spec.components ?? {}));
      console.log('security schemes', spec.components?.securitySchemes);
      console.log(
        'selecting security scheme for',
        apiName,
        securitySchemeNames[apiName],
        'from',
        Object.keys(spec.components?.securitySchemes ?? {}),
      );
      securitySchemeObjects[apiName] = spec.components?.securitySchemes?.[
        securitySchemeNames[apiName]
      ] as OpenAPIV3.SecuritySchemeObject;
    }),
  );
  console.log(
    'Selected security scheme objects for all APIs',
    securitySchemeObjects,
  );
  const bearerTokens = await getBearerTokens(apiNames, securitySchemeObjects);
  await Promise.all(
    apiNames.map(async (specName) => {
      const specStr = specStrs[specName];
      const overlayStr = overlayStrs[specName];
      const syncer = new Syncer({
        specStr,
        overlayStr,
        authHeaders: {
          Authorization: `Bearer ${bearerTokens[specName]}`,
        },
        fetchFunction,
        dbConn:
          'postgresql://syncables:syncables@localhost:5432/syncables?sslmode=disable',
      });
      if (process.argv.length > 2) {
        const filter: string[] = process.argv.slice(2).at(0)?.split(',') ?? [];
        console.log(
          `Filtering syncables for ${specName} with filter:`,
          JSON.stringify(filter),
        );
        return await syncer.fullFetch(filter);
      }
      // void syncer;
      return await syncer.fullFetch();
    }),
  );
}

// ... Run the main function
void main().catch((err) => {
  console.error('Error in main execution:', err);
  process.exit(1);
});
