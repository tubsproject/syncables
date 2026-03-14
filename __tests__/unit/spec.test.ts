import { describe, expect, it } from 'vitest';
import { Syncer } from '../../src/syncer.js';
import { SyncableSpecInput, PaginationScheme } from '../../src/spec.js';
import { createSpec } from '../helpers/createSpec.js';

describe('Spec parsing', () => {
  it('can parse one syncable spec out of an OAD', async () => {
    const spec: SyncableSpecInput = {
      type: 'collection',
      name: '/widgets/',
      // query: { color: 'red' },
      defaultPageSize: undefined,
      idField: 'id',
    };
    const paginationScheme: PaginationScheme = {
      paginate: 'data.items',
      pageNumber: {
        parameter: 'page',
      },
    };
    const syncer = new Syncer({
      specStr: createSpec(
        '//example.com/api',
        {
          '/widgets/': spec,
        },
        paginationScheme,
        {
          parameters: {
            customerId: 'customers.id',
          },
        },
      ),
    });
    await syncer.parseSpec();
    expect(syncer.syncables['/widgets/'].path).toEqual('/widgets/');
    expect(syncer.syncables['/widgets/'].spec).toEqual(
      Object.assign(
        {
          forcePageSizeParamInQuery: undefined,
          itemsPathInResponse: ['data', 'items'],
          paginationStrategy: 'pageNumber',
          pageNumberParamInQuery: 'page',
          parameters: {},
        },
        spec,
      ),
    );
    expect(syncer.baseUrl).toEqual('https://example.com/api');
  });
});
