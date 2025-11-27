import { describe, expect, it } from 'vitest';
import { Syncable } from '../../src/syncable.js';

type Widget = {
  id: number;
  name: string;
  color: string;
};

describe('Spec parsing', () => {
  it('can parse the syncable spec out of an OAD', () => {
    const syncable = new Syncable<Widget>({
      pagingStrategy: 'pageNumber',
    });
    syncable.parseSpec({
      paths: {
        '/widgets': {
          get: {
            parameters: [
              {
                name: 'page',
                in: 'query',
                schema: {
                  type: 'integer',
                  default: 1,
                },
              }
            ],
            responses: {
              '200': {
                description: 'A list of widgets.',
                content: {
                  'application/json': {
                    syncable: {
                      pagingStrategy: 'pageNumber',
                      pageNumberParamInQuery: 'page',
                    },
                    schema: {
                      type: 'object',
                      properties: {
                        items: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Widget',
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
        },
      },
      components: {
        schemas: {
          Widget: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
              },
              name: {
                type: 'string',
              },
              color: {
                type: 'string',
              },
            },
          },
        },
      },
    });
    expect(syncable.spec).toEqual({
      pagingStrategy: 'pageNumber',
      pageNumberParamInQuery: 'page',
      listUrl: '/widgets',
    });
  });
});
