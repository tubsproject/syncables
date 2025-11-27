import { stringify } from 'yaml';
import { SyncableConfig } from '../../src/syncable.js';
export function createSpec(config: SyncableConfig): string {
  const specObj = {
    openapi: '3.0.0',
    info: {
    title: 'Test API',
    version: '1.0.0',
    },
    servers: [
    {
      url: config.baseUrl,
    },
    ],
    paths: {},
    components: {
    schemas: {},
    },
  };
  specObj.paths[config.urlPath] = {
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
  return stringify(specObj);
}
