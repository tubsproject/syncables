import { describe, expect, it } from 'vitest';
import { Syncable, SyncableConfig } from '../../src/syncable.js';
import { createSpec } from '../helpers/createSpec.js';

type Widget = {
  id: number;
  name: string;
  color: string;
};

describe('Spec parsing', () => {
  it('can parse the syncable spec out of an OAD', async () => {
    const config: SyncableConfig = {
      name: 'widgets',
      paginationStrategy: 'pageNumber',
      pageNumberParamInQuery: 'page',
      baseUrl: 'https://example.com/api',
      urlPath: '/widgets',
      query: { color: 'red' },
      itemsPathInResponse: ['data', 'items'],
      defaultPageSize: undefined,
      forcePageSize: undefined,
      forcePageSizeParamInQuery: undefined,
      idField: 'id',
    };
    const syncable = new Syncable<Widget>({
      specStr: createSpec(config),
      specFilename: '',
      syncableName: 'widgets',
    });
    await syncable.parseSpec();
    expect(syncable.config).toEqual(config);
  });
});
