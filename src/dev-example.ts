import { readdir } from 'fs/promises';
import { mkdirp } from 'mkdirp';
import { OpenAPIV3 } from '@scalar/openapi-types';
import { Syncer, specStrToObj } from './syncer.js';
import { fetchFunction } from './caching-fetch.js';
import { getBearerTokens } from './auth.js';
import { readSpec } from './utils.js';

const securitySchemeNames = {
  // acube: 'acube',
  'arratech-peppol': 'cognito',
  // 'google-calendar': 'Oauth2c',
  // 'maventa-peppol': 'oauth2',
  // moneybird: 'oauth2',
  // netfly: 'oauth2', this is a nice example of client credentials flow and I think I got the implementation right, but my test account for netfly was deactivated on 19 January 2026
};

async function main(): Promise<void> {
  await mkdirp('.fetch-cache'); // Ensure the cache directory exists
  await mkdirp('.tokens'); // Ensure the tokens directory exists
  const specFileNames = await readdir('./openapi/oad/');
  const apiNames = specFileNames
    .map((fileName) => fileName.replace('.yaml', '').replace('.json', ''))
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
      specStrs[apiName] = await readSpec('spec', apiName);
      overlayStrs[apiName] = await readSpec('overlay', apiName);
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
