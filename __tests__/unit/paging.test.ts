import { createSpec } from '../helpers/createSpec.js';
import { createFetchMock } from '../helpers/createFetchMock.js';
import { test, expect } from 'vitest';
import { Syncer } from '../../src/syncer.js';

test('pageNumber paging (unkown page size)', async () => {
  const { fetchMock, mockResponses } = createFetchMock();
  // console.log('Mock responses:', mockResponses);
  // Call the function and assert the result
  const syncable = new Syncer({
    specStr: createSpec(
      'https://jsonplaceholder.typicode.com',
      {
        '/todos/': {
          type: 'collection',
          name: 'todos',
        },
      },
      {
        paginate: 'items',
        pageNumber: { parameter: 'page' },
      },
      { parameters: {} },
    ),
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  // console.log('fullFetch start');
  const data = await syncable.fullFetch();
  // console.log('fullFetch end');
  expect(data).toEqual({
    '/todos/': mockResponses[0].items.concat(mockResponses[1].items),
  });

  // Check that fetch was called exactly thrice
  expect(fetchMock).toHaveBeenCalledTimes(3);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?page=1',
    { headers: {} },
  );
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?page=2',
    { headers: {} },
  );
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?page=3',
    { headers: {} },
  );
});

test('pageNumber paging (default page size', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncer({
    specStr: createSpec(
      'https://jsonplaceholder.typicode.com',
      {
        '/todos/': {
          type: 'collection',
          name: 'todos',
          defaultPageSize: 2,
        },
      },
      {
        paginate: 'items',
        pageNumber: { parameter: 'page' },
      },
      { parameters: {} },
    ),
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual({
    '/todos/': mockResponses[0].items.concat(mockResponses[1].items),
  });

  // Check that fetch was called exactly twice
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?page=1',
    { headers: {} },
  );
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?page=2',
    { headers: {} },
  );
});

test('pageNumber paging (force page size', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncer({
    specStr: createSpec(
      'https://jsonplaceholder.typicode.com',
      {
        '/todos/': {
          type: 'collection',
          name: 'todos',
        },
      },
      {
        paginate: 'items',
        pageNumber: { parameter: 'page' },
      },
      { parameters: {} },
    ),
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual({
    '/todos/': mockResponses[0].items.concat(mockResponses[1].items),
  });

  // Check that fetch was called exactly twice
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?page=1&pageSize=2',
    { headers: {} },
  );
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?page=2&pageSize=2',
    { headers: {} },
  );
});

test('offset paging (unknown page size)', async () => {
  const { fetchMock, mockResponses } = createFetchMock();
  const specStr = createSpec(
    'https://jsonplaceholder.typicode.com',
    {
      '/todos/': {
        type: 'collection',
        name: 'todos',
      },
    },
    {
      paginate: 'items',
      offset: { parameter: 'offset' },
    },
    { parameters: {} },
  );
  // Call the function and assert the result
  const syncable = new Syncer({
    specStr,
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual({
    '/todos/': mockResponses[0].items.concat(mockResponses[1].items),
  });

  // Check that fetch was called exactly thrice
  expect(fetchMock).toHaveBeenCalledTimes(3);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?offset=0',
    { headers: {} },
  );
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?offset=2',
    { headers: {} },
  );
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?offset=3',
    { headers: {} },
  );
});

test('offset paging (default page size)', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncer({
    specStr: createSpec(
      'https://jsonplaceholder.typicode.com',
      {
        '/todos/': {
          type: 'collection',
          name: 'todos',
          defaultPageSize: 2,
        },
      },
      {
        paginate: 'items',
        offset: { parameter: 'offset' },
      },
      { parameters: {} },
    ),
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual({
    '/todos/': mockResponses[0].items.concat(mockResponses[1].items),
  });

  // Check that fetch was called exactly twice
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?offset=0',
    { headers: {} },
  );
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?offset=2',
    { headers: {} },
  );
});

test('offset paging (force page size)', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncer({
    specStr: createSpec(
      'https://jsonplaceholder.typicode.com',
      {
        '/todos/': {
          type: 'collection',
          name: 'todos',
        },
      },
      {
        paginate: 'items',
        offset: { parameter: 'offset' },
      },
      { parameters: {} },
    ),
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual({
    '/todos/': mockResponses[0].items.concat(mockResponses[1].items),
  });

  // Check that fetch was called exactly twice
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?offset=0&pageSize=2',
    { headers: {} },
  );
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?offset=2&pageSize=2',
    { headers: {} },
  );
});

test('pageToken paging', async () => {
  const { fetchMock, mockResponses } = createFetchMock(true);

  // Call the function and assert the result
  const syncable = new Syncer({
    specStr: createSpec(
      'https://jsonplaceholder.typicode.com',
      {
        '/todos/': {
          type: 'collection',
          name: 'todos',
        },
      },
      {
        paginate: 'items',
        token: { parameter: 'pageToken', responseBody: 'nextPageToken' },
      },
      { parameters: {} },
    ),
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual({
    '/todos/': mockResponses[0].items.concat(mockResponses[1].items),
  });

  // Check that fetch was called exactly twice
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/',
    { headers: {} },
  );
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?pageToken=token1',
    { headers: {} },
  );
});

test.skip('rangeHeader paging', async () => {
  const { fetchMock, mockResponses } = createFetchMock(true);

  // Call the function and assert the result
  const syncable = new Syncer({
    specStr: createSpec(
      'https://jsonplaceholder.typicode.com',
      {
        '/todos/': {
          type: 'collection',
          name: 'todos',
        },
      },
      {
        paginate: 'items',
      },
      { parameters: {} },
    ),
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual({
    '/todos/': mockResponses[0].items.concat(mockResponses[1].items),
  });

  // Check that fetch was called exactly twice
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/',
    { headers: { Range: 'id ..; max=2' } },
  );
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/',
    { headers: { Range: 'id ]2..; max=2' } },
  );
});
