import { describe, expect, it } from 'vitest';
import { Syncer, SyncableSpec } from '../../src/syncer.js';
import { createSpec } from '../helpers/createSpec.js';

type Widget = {
  id: number;
  name: string;
  color: string;
};

describe('Spec parsing', () => {
  it('can parse one syncable spec out of an OAD', async () => {
    const spec: SyncableSpec = {
      name: 'widgets',
      paginationStrategy: 'pageNumber',
      pageNumberParamInQuery: 'page',
      query: { color: 'red' },
      itemsPathInResponse: ['data', 'items'],
      defaultPageSize: undefined,
      forcePageSize: undefined,
      forcePageSizeParamInQuery: undefined,
      idField: 'id',
      params: {
        customerId: 'customers.id',
      },
    };
    const syncer = new Syncer<Widget>({
      specStr: createSpec('https://example.com/api', {
        '/widgets/': spec,
      }),
    });
    await syncer.parseSpec();
    expect(syncer.syncables['widgets'].path).toEqual('/widgets/');
    expect(syncer.syncables['widgets'].spec).toEqual(spec);
  });
});
