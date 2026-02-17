import { describe, expect, it } from 'vitest';
import { Syncer, SyncableSpec } from '../../src/syncer.js';
import { createSpec } from '../helpers/createSpec.js';
import { createFetchMock } from '../helpers/createFetchMock.js';

describe('Params', () => {
  it('can deal with params in syncable specs', async () => {
    const { fetchMock, mockResponses } = createFetchMock(true);
    const users: SyncableSpec = {
      name: 'users',
      paginationStrategy: 'pageNumber',
      itemsPathInResponse: ['items'],
    };
    const widgets: SyncableSpec = {
      name: 'widgets',
      paginationStrategy: 'pageNumber',
      itemsPathInResponse: ['items'],
      params: {
        userId: 'users.id',
      },
    };
    const syncer = new Syncer({
      specStr: createSpec('https://example.com/api', {
        '/users/': users,
        '/user/{userId}/widgets/': widgets,
      }),
      fetchFunction: fetchMock as unknown as typeof fetch,
    });
    const data = await syncer.fullFetch();
    expect(Object.keys(data).sort()).toEqual(['users', 'widgets']);
    ['users', 'widgets'].forEach((key) => {
      let items = [];
      for (let i = 0; i < (key === 'users' ? 1 : 3); i++) {
        const userIdAddition = (key === 'users' ? {} : { userId: (i + 1).toString() });
        // console.log('userIdAddition:', key, i, userIdAddition);
        items = items.concat(mockResponses[0].items.map((item) => Object.assign({}, item, userIdAddition )));
        items = items.concat(mockResponses[1].items.map((item) => Object.assign({}, item, userIdAddition )));
      }
      expect(data[key]).toEqual(items);
    });
    expect(fetchMock.mock.calls).toEqual([
      ['https://example.com/api/users/?page=1', { headers: {} }],
      ['https://example.com/api/users/?page=2', { headers: {} }],
      ['https://example.com/api/users/?page=3', { headers: {} }],
      ['https://example.com/api/user/1/widgets/?page=1', { headers: {} }],
      ['https://example.com/api/user/1/widgets/?page=2', { headers: {} }],
      ['https://example.com/api/user/1/widgets/?page=3', { headers: {} }],
      ['https://example.com/api/user/2/widgets/?page=1', { headers: {} }],
      ['https://example.com/api/user/2/widgets/?page=2', { headers: {} }],
      ['https://example.com/api/user/2/widgets/?page=3', { headers: {} }],
      ['https://example.com/api/user/3/widgets/?page=1', { headers: {} }],
      ['https://example.com/api/user/3/widgets/?page=2', { headers: {} }],
      ['https://example.com/api/user/3/widgets/?page=3', { headers: {} }],
    ]);
  });

  it('can ignore circular references in params', async () => {
    const { fetchMock } = createFetchMock(true);
    const users: SyncableSpec = {
      name: 'users',
      paginationStrategy: 'pageNumber',
      itemsPathInResponse: ['items'],
      params: {
        widgetId: 'widgets.id',
      },
    };
    const widgets: SyncableSpec = {
      name: 'widgets',
      paginationStrategy: 'pageNumber',
      itemsPathInResponse: ['items'],
      params: {
        userId: 'users.id',
      },
    };
    const syncer = new Syncer({
      specStr: createSpec('https://example.com/api', {
        '/users/': users,
        '/user/{userId}/widgets/': widgets,
      }),
      fetchFunction: fetchMock as unknown as typeof fetch,
    });
    const data = await syncer.fullFetch();
    expect(data).toEqual({});
    expect(fetchMock.mock.calls).toEqual([]);
  });

  it('can fill in multiple references in params', async () => {
    const { fetchMock, mockResponses } = createFetchMock(true);
    const countries: SyncableSpec = {
      name: 'countries',
      paginationStrategy: 'pageNumber',
      itemsPathInResponse: ['items'],
    };
    const users: SyncableSpec = {
      name: 'users',
      paginationStrategy: 'pageNumber',
      itemsPathInResponse: ['items'],
    };
    const widgets: SyncableSpec = {
      name: 'widgets',
      paginationStrategy: 'pageNumber',
      itemsPathInResponse: ['items'],
      params: {
        userId: 'users.id',
        countryId: 'countries.id',
      },
    };
    const syncer = new Syncer({
      specStr: createSpec('https://example.com/api', {
        '/countries/': countries,
        '/users/': users,
        '/{countryId}/{userId}/widgets/': widgets,
      }),
      fetchFunction: fetchMock as unknown as typeof fetch,
    });
    const data = await syncer.fullFetch();
    expect(Object.keys(data).sort()).toEqual(['countries', 'users', 'widgets']);
    // ['countries', 'users', 'widgets'].forEach((key) => {
    ['countries'].forEach((key) => {
      let items = [];
      for (let i = 0; i < (key === 'widgets' ? 9 : 1); i++) {
        items = items.concat(mockResponses[0].items);
        items = items.concat(mockResponses[1].items);
      }
      expect(data[key]).toEqual(items);
    });
    const expectedCalls = [
      ['https://example.com/api/countries/?page=1', { headers: {} }],
      ['https://example.com/api/countries/?page=2', { headers: {} }],
      ['https://example.com/api/countries/?page=3', { headers: {} }],
      ['https://example.com/api/users/?page=1', { headers: {} }],
      ['https://example.com/api/users/?page=2', { headers: {} }],
      ['https://example.com/api/users/?page=3', { headers: {} }],
    ];
    for (let thisUserId = 1; thisUserId <= 3; thisUserId++) {
      for (let thisCountryId = 1; thisCountryId <= 3; thisCountryId++) {
        for (let page = 1; page <= 3; page++) {
          // console.log('pushing', thisCountryId, thisUserId, page);
          expectedCalls.push([
            `https://example.com/api/${thisCountryId}/${thisUserId}/widgets/?page=${page}`,
            { headers: {} },
          ]);
        }
      }
    }
    // console.log('expected calls:', expectedCalls);
    expect(fetchMock.mock.calls).toEqual(expectedCalls);
  });
});
