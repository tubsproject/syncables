import { readdir } from 'fs/promises';
import { Syncer } from './syncer.js';
import { fetchFunction } from './caching-fetch.js';
import { getAuthHeaderSets } from './auth.js';
import { getSecuritySchemeObjects } from './utils.js';
import { storeData, resetStore, TypedObject } from './schemaStore.js';
// import { /* components, */ paths } from './github.js';

// type IssueIn = paths['/repos/{owner}/{repo}/issues']['post']['requestBody']['content']['application/json'];
// type IssueOut = components['schemas']['issue'];

const securitySchemeNames = {
  // acube: 'acube',
  'google-calendar': 'Oauth2c',
  // moneybird: 'oauth2',
  // netfly: 'oauth2',
  // github: 'oauth2',
  // 'slack-web': 'slackAuth',
};

async function main(): Promise<void> {
  const overlayFileNames = await readdir('./openapi/overlay/');
  const apiNames = overlayFileNames
    .map((fileName) =>
      fileName.replace('-overlay.yaml', '').replace('-overlay.json', ''),
    )
    .filter((name) => {
      console.log('checking name', name, Object.keys(securitySchemeNames));
      return Object.keys(securitySchemeNames).includes(name);
    });
  console.log('Found API specs for:', apiNames);
  const { securitySchemeObjects, specStrs, overlayStrs } =
    await getSecuritySchemeObjects(apiNames, securitySchemeNames);
  console.log(
    'Selected security scheme objects for all APIs',
    securitySchemeObjects,
  );

  const authHeaders = await getAuthHeaderSets(apiNames, securitySchemeObjects);
  console.log('Obtained bearer tokens for all APIs');

  console.log('Obtained bearer tokens for all APIs');
  await Promise.all(
    apiNames.map(async (specName) => {
      const specStr = specStrs[specName];
      const overlayStr = overlayStrs[specName];
      const syncer = new Syncer({
        specStr,
        overlayStr,
        authHeaders: authHeaders[specName],
        fetchFunction,
      });
      await resetStore(specName);
      if (process.argv.length > 2) {
        const paramsSpecs: string[] =
          process.argv.slice(2).at(0)?.split(',') ?? [];
        const params: { [placeholder: string]: string } = {};
        for (const paramsSpec of paramsSpecs) {
          const [placeholder, value] = paramsSpec.split('=');
          if (placeholder && value) {
            params[placeholder] = value;
          }
        }
        const filter: string[] | undefined =
          process.argv.slice(3).at(0)?.split(',') ?? undefined;
        console.log(
          `Filtering syncables for ${specName} with filter:`,
          JSON.stringify(filter),
        );
        await syncer.fullFetch(
          async (syncableName: string, items: TypedObject) => {
            await storeData(specName, syncableName, items).catch((err) => {
              console.error(
                `Error storing data for ${syncableName} of API ${specName}:`,
                err,
              );
            });
          },
          params,
          filter,
        );
      } else {
        await syncer.fullFetch(
          async (syncableName: string, items: TypedObject) => {
            await storeData(specName, syncableName, items).catch((err) => {
              console.error(
                `Error storing data for ${syncableName} of API ${specName}:`,
                err,
              );
            });
          },
        );
      }
      // await syncer.parseSpec();
      // await syncer.addItem(
      //   '/repos/{owner}/{repo}/issues',
      //   { title: 'testing issue addition' } as IssueIn,
      //   { owner: 'michielbdejong', repo: 'bookkeeping.network' },
      // );
    }),
  );
}

// ... Run the main function
void main().catch((err) => {
  console.error('Error in main execution:', err);
  process.exit(1);
});
