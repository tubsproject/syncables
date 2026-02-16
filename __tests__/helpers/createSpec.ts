import { stringify } from 'yaml';
import { SyncableSpec } from '../../src/syncer.js';
export function createSpec(baseUrl: string, configs: { [path: string]: SyncableSpec }): string {
  const specObj = {
    openapi: '3.0.0',
    info: {
      title: 'Test API',
      version: '1.0.0',
    },
    servers: [
      {
        url: baseUrl,
      },
    ],
    paths: {},
    components: {
      schemas: {},
    },
  };
  for (const path in configs) {
    const config = configs[path];
    specObj.paths[path] = {
      get: {
        responses: {
          '200': {
            description: 'A list of items.',
            content: {
              'application/json': {
                syncable: config,
                schema: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                      },
                    },
                    hasMore: {
                      type: 'boolean',
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
  }
  return stringify(specObj);
}
