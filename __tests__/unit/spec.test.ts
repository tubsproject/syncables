import { describe, expect, it } from 'vitest';
import { Syncer, SyncerConfig } from '../../src/syncer.js';
import { createSpec } from '../helpers/createSpec.js';

type Widget = {
  id: number;
  name: string;
  color: string;
};

describe('Spec parsing', () => {
  it('can parse one syncable spec out of an OAD', async () => {
    const config: SyncerConfig = {
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
    const syncable = new Syncer<Widget>({
      specStr: createSpec(config),
      specFilename: '',
    });
    await syncable.parseSpec();
    expect(syncable.config).toEqual(config);
  });
});
