import { describe, expect, it } from 'vitest';
import { Syncer } from '../../src/syncer.js';
import { SyncableSpecInput, PaginationScheme } from '../../src/spec.js';
import { createSpec } from '../helpers/createSpec.js';
import { createFetchMock } from '../helpers/createFetchMock.js';

describe('Params', () => {
  const relations = {
    parameters: {
      userId: '/users/#id',
    },
  };
  it.only('can deal with parameters in syncable specs', async () => {
    const { fetchMock, mockResponses } = createFetchMock(true);
    const users: SyncableSpecInput = {
      type: 'collection',
      name: 'users',
    };
    const widgets: SyncableSpecInput = {
      type: 'collection',
      name: 'widgets',
    };
    const paginationScheme: PaginationScheme = {
      paginate: 'items',
      pageNumber: { parameter: 'page' },
    };
    const syncer = new Syncer({
      specStr: createSpec(
        'https://example.com/api',
        {
          '/users/': users,
          '/user/{userId}/widgets/': widgets,
        },
        paginationScheme,
        relations,
      ),
      fetchFunction: fetchMock as unknown as typeof fetch,
    });
    const data = await syncer.fullFetch();
    const paths = ['/user/{userId}/widgets/', '/users/'];
    expect(Object.keys(data).sort()).toEqual(paths);
    paths.forEach((path) => {
      let items = [];
      for (let i = 0; i < (path === '/users/' ? 1 : 3); i++) {
        const userIdAddition =
          path === '/users/' ? {} : { userId: (i + 1).toString() };
        console.log('userIdAddition:', path, i, userIdAddition);
        items = items.concat(
          mockResponses[0].items.map((item) =>
            Object.assign({}, item, userIdAddition),
          ),
        );
        items = items.concat(
          mockResponses[1].items.map((item) =>
            Object.assign({}, item, userIdAddition),
          ),
        );
      }
      expect(data[path]).toEqual(items);
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

  it('can ignore circular references in parameters', async () => {
    const { fetchMock } = createFetchMock(true);
    const users: SyncableSpecInput = {
      type: 'collection',
      name: 'users',
      parameters: {
        widgetId: 'widgets.id',
      },
    };
    const widgets: SyncableSpecInput = {
      type: 'collection',
      name: 'widgets',
      parameters: {
        userId: 'users.id',
      },
    };
    const paginationScheme: PaginationScheme = {
      paginate: 'items',
      pageNumber: { parameter: 'page' },
    };

    const syncer = new Syncer({
      specStr: createSpec(
        'https://example.com/api',
        {
          '/users/': users,
          '/user/{userId}/widgets/': widgets,
        },
        paginationScheme, relations
      ),
      fetchFunction: fetchMock as unknown as typeof fetch,
    });
    const data = await syncer.fullFetch();
    expect(data).toEqual({});
    expect(fetchMock.mock.calls).toEqual([]);
  });

  it('can fill in multiple references in parameters', async () => {
    const { fetchMock, mockResponses } = createFetchMock(true);
    const countries: SyncableSpecInput = {
      type: 'collection',
      name: 'countries',
    };
    const users: SyncableSpecInput = {
      type: 'collection',
      name: 'users',
    };
    const widgets: SyncableSpecInput = {
      type: 'collection',
      name: 'widgets',
      parameters: {
        userId: 'users.id',
        countryId: 'countries.id',
      },
    };
    const paginationScheme: PaginationScheme = {
      paginate: 'items',
      pageNumber: { parameter: 'page' },
    };
    const syncer = new Syncer({
      specStr: createSpec(
        'https://example.com/api',
        {
          '/countries/': countries,
          '/users/': users,
          '/{countryId}/{userId}/widgets/': widgets,
        },
        paginationScheme, { parameters: {}}
      ),
      fetchFunction: fetchMock as unknown as typeof fetch,
    });
    const data = await syncer.fullFetch();
    const paths = ['/countries/', '/users/', '/{countryId}/{userId}/widgets/'];
    expect(Object.keys(data).sort()).toEqual(paths);
    paths.forEach((path) => {
      let items = [];
      for (let i = 0; i < (path === '/{countryId}/{userId}/widgets/' ? 9 : 1); i++) {
        items = items.concat(mockResponses[0].items);
        items = items.concat(mockResponses[1].items);
      }
      expect(data[path]).toEqual(items);
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
