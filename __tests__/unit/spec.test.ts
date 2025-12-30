import { describe, expect, it } from 'vitest';
import { Syncable, SyncableConfig } from '../../src/syncable.js';
import { createSpec } from '../helpers/createSpec.js';

type Widget = {
  id: number;
  name: string;
  color: string;
};

describe('Spec parsing', () => {
  it('can parse the syncable spec out of an OAD', () => {
    const config: SyncableConfig = {
      name: 'widgets',
      pagingStrategy: 'pageNumber',
      pageNumberParamInQuery: 'page',
      baseUrl: 'https://example.com/api',
      urlPath: '/widgets',
      query: { color: 'red' },
      itemsPathInResponse: ['data', 'items'],
    };
    const syncable = new Syncable<Widget>({
      specStr: createSpec(config),
      syncableName: 'widgets',
    });
    expect(syncable.config).toEqual(config);
  });
});
