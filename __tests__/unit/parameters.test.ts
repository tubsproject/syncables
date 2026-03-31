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
  it('can deal with parameters in syncable specs', async () => {
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
    const params = {
      userId: '/users/#id',
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
    const data = await syncer.fullFetch(() => Promise.resolve(), params);
    const paths = ['/user/{userId}/widgets/', '/users/'];
    expect(Object.keys(data).sort()).toEqual(paths);
    paths.forEach((path) => {
      let items = [];
      for (let i = 0; i < (path === '/users/' ? 1 : 3); i++) {
        const userIdAddition = path === '/users/' ? {} : { userId: i + 1 };
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
      expect(data[path]).toEqual({ data: items, schema: undefined });
    });
    expect(fetchMock.mock.calls).toEqual([
      ['https://example.com/api/users/?page=1', { headers: {} }],
      ['https://example.com/api/users/?page=2', { headers: {} }],
      ['https://example.com/api/users/?page=3', { headers: {} }],
      ['https://example.com/api/user/1/widgets/?page=1', { headers: {} }],
      ['https://example.com/api/user/2/widgets/?page=1', { headers: {} }],
      ['https://example.com/api/user/3/widgets/?page=1', { headers: {} }],
      ['https://example.com/api/user/1/widgets/?page=2', { headers: {} }],
      ['https://example.com/api/user/2/widgets/?page=2', { headers: {} }],
      ['https://example.com/api/user/3/widgets/?page=2', { headers: {} }],
      ['https://example.com/api/user/1/widgets/?page=3', { headers: {} }],
      ['https://example.com/api/user/2/widgets/?page=3', { headers: {} }],
      ['https://example.com/api/user/3/widgets/?page=3', { headers: {} }],
    ]);
  });

  it('can ignore circular references in parameters', async () => {
    const { fetchMock } = createFetchMock(true);
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
    const params = {
      userId: '/users/#id',
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
    const data = await syncer.fullFetch(() => Promise.resolve(), params);
    expect(data).toEqual({
      '/user/{userId}/widgets/': {
        data: [
          { id: 1, title: 'Test Todo 1', userId: 1 },
          { id: 2, title: 'Test Todo 2', userId: 1 },
          { id: 3, title: 'Test Todo 3', userId: 1 },
          { id: 1, title: 'Test Todo 1', userId: 2 },
          { id: 2, title: 'Test Todo 2', userId: 2 },
          { id: 3, title: 'Test Todo 3', userId: 2 },
          { id: 1, title: 'Test Todo 1', userId: 3 },
          { id: 2, title: 'Test Todo 2', userId: 3 },
          { id: 3, title: 'Test Todo 3', userId: 3 },
        ],
        schema: undefined,
      },
      '/users/': {
        data: [
          { id: 1, title: 'Test Todo 1' },
          { id: 2, title: 'Test Todo 2' },
          { id: 3, title: 'Test Todo 3' },
        ],
        schema: undefined,
      },
    });
    expect(fetchMock.mock.calls).toEqual([
      [
        'https://example.com/api/users/?page=1',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/users/?page=2',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/users/?page=3',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/user/1/widgets/?page=1',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/user/2/widgets/?page=1',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/user/3/widgets/?page=1',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/user/1/widgets/?page=2',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/user/2/widgets/?page=2',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/user/3/widgets/?page=2',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/user/1/widgets/?page=3',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/user/2/widgets/?page=3',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/user/3/widgets/?page=3',
        {
          headers: {},
        },
      ],
    ]);
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
    };
    const paginationScheme: PaginationScheme = {
      paginate: 'items',
      pageNumber: { parameter: 'page' },
    };
    const params = {
      userId: '/users/#id',
      countryId: '/countries/#id',
    };
    const specStr = createSpec(
      'https://example.com/api',
      {
        '/countries/': countries,
        '/users/': users,
        '/{countryId}/{userId}/widgets/': widgets,
      },
      paginationScheme,
      {
        parameters: params,
      },
    );
    console.log(specStr);
    const syncer = new Syncer({
      specStr,
      fetchFunction: fetchMock as unknown as typeof fetch,
    });
    const data = await syncer.fullFetch(() => Promise.resolve(), params);
    const paths = ['/countries/', '/users/', '/{countryId}/{userId}/widgets/'];
    expect(Object.keys(data).sort()).toEqual(paths);
    paths.forEach((path) => {
      let items = [];
      for (
        let i = 0;
        i < (path === '/{countryId}/{userId}/widgets/' ? 9 : 1);
        i++
      ) {
        items = items.concat(
          mockResponses[0].items.map((item) => {
            const userId = Math.floor(i / 3) + 1;
            const countryId = (i % 3) + 1;
            if (path === '/users/' || path === '/countries/') {
              return item;
            }
            return Object.assign({}, item, {
              countryId: countryId,
              userId: userId,
            });
          }),
        );
        items = items.concat(
          mockResponses[1].items.map((item) => {
            const userId = Math.floor(i / 3) + 1;
            const countryId = (i % 3) + 1;
            if (path === '/users/' || path === '/countries/') {
              return item;
            }
            return Object.assign({}, item, {
              countryId: countryId,
              userId: userId,
            });
          }),
        );
      }
      if (path === '/{countryId}/{userId}/widgets/') {
        items = [
          {
            countryId: 3,
            id: 1,
            title: 'Test Todo 1',
            userId: 2,
          },
          {
            countryId: 3,
            id: 2,
            title: 'Test Todo 2',
            userId: 2,
          },
          {
            countryId: 3,
            id: 3,
            title: 'Test Todo 3',
            userId: 2,
          },
          {
            countryId: 3,
            id: 1,
            title: 'Test Todo 1',
            userId: 3,
          },
          {
            countryId: 3,
            id: 2,
            title: 'Test Todo 2',
            userId: 3,
          },
          {
            countryId: 3,
            id: 3,
            title: 'Test Todo 3',
            userId: 3,
          },
          {
            countryId: 1,
            id: 1,
            title: 'Test Todo 1',
            userId: 1,
          },
          {
            countryId: 1,
            id: 2,
            title: 'Test Todo 2',
            userId: 1,
          },
          {
            countryId: 1,
            id: 3,
            title: 'Test Todo 3',
            userId: 1,
          },
          {
            countryId: 2,
            id: 1,
            title: 'Test Todo 1',
            userId: 1,
          },
          {
            countryId: 2,
            id: 2,
            title: 'Test Todo 2',
            userId: 1,
          },
          {
            countryId: 2,
            id: 3,
            title: 'Test Todo 3',
            userId: 1,
          },
          {
            countryId: 3,
            id: 1,
            title: 'Test Todo 1',
            userId: 1,
          },
          {
            countryId: 3,
            id: 2,
            title: 'Test Todo 2',
            userId: 1,
          },
          {
            countryId: 3,
            id: 3,
            title: 'Test Todo 3',
            userId: 1,
          },
        ];
      }
      expect(data[path]).toEqual({ data: items, schema: undefined });
    });
    const expectedCalls = [
      ['https://example.com/api/countries/?page=1', { headers: {} }],
      ['https://example.com/api/countries/?page=2', { headers: {} }],
      ['https://example.com/api/countries/?page=3', { headers: {} }],
      ['https://example.com/api/users/?page=1', { headers: {} }],
      ['https://example.com/api/users/?page=2', { headers: {} }],
      ['https://example.com/api/users/?page=3', { headers: {} }],
      [
        'https://example.com/api/1/1/widgets/?page=1',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/2/1/widgets/?page=1',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/3/1/widgets/?page=1',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/3/2/widgets/?page=1',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/3/3/widgets/?page=1',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/1/1/widgets/?page=2',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/2/1/widgets/?page=2',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/3/1/widgets/?page=2',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/3/2/widgets/?page=2',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/3/3/widgets/?page=2',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/1/1/widgets/?page=3',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/2/1/widgets/?page=3',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/3/1/widgets/?page=3',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/3/2/widgets/?page=3',
        {
          headers: {},
        },
      ],
      [
        'https://example.com/api/3/3/widgets/?page=3',
        {
          headers: {},
        },
      ],
    ];
    expect(fetchMock.mock.calls).toEqual(expectedCalls);
  });
});
