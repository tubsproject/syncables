import { createSpec } from '../helpers/createSpec.js';
import { createFetchMock } from '../helpers/createFetchMock.js';
import { test, expect } from 'vitest';
import { Syncable } from '../../src/syncable.js';

test('pageNumber paging (unkown page size)', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncable({
    specStr: createSpec({
      name: 'todos',
      pagingStrategy: 'pageNumber',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      urlPath: '/todos/',
      pageNumberParamInQuery: 'page',
      itemsPathInResponse: ['items'],
    }),
    syncableName: 'todos',
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly thrice
  expect(fetchMock).toHaveBeenCalledTimes(3);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?page=1', { headers: {} });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?page=2', { headers: {} });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?page=3', { headers: {} });
});

test('pageNumber paging (default page size', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncable({
    specStr: createSpec({
      name: 'todos',
      pagingStrategy: 'pageNumber',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      urlPath: '/todos/',
      pageNumberParamInQuery: 'page',
      itemsPathInResponse: ['items'],
      defaultPageSize: 2,
    }),
    syncableName: 'todos',
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly twice
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?page=1', { headers: {} });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?page=2', { headers: {} });
});

test('pageNumber paging (force page size', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncable({
    specStr: createSpec({
      name: 'todos',
      pagingStrategy: 'pageNumber',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      urlPath: '/todos/',
      pageNumberParamInQuery: 'page',
      itemsPathInResponse: ['items'],
      forcePageSize: 2,
    }),
    syncableName: 'todos',
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly twice
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?page=1&pageSize=2', { headers: {} });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?page=2&pageSize=2', { headers: {} });
});

test('offset paging (unknown page size)', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncable({
    specStr: createSpec({
      name: 'todos',
      pagingStrategy: 'offset',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      urlPath: '/todos/',
      offsetParamInQuery: 'offset',
      itemsPathInResponse: ['items'],
    }),
    syncableName: 'todos',
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly thrice
  expect(fetchMock).toHaveBeenCalledTimes(3);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?offset=0', { headers: {} });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?offset=2', { headers: {} });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?offset=3', { headers: {} });
});

test('offset paging (default page size)', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncable({
    specStr: createSpec({
      name: 'todos',
      pagingStrategy: 'offset',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      urlPath: '/todos/',
      offsetParamInQuery: 'offset',
      itemsPathInResponse: ['items'],
      defaultPageSize: 2,
    }),
    syncableName: 'todos',
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly twice
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?offset=0', { headers: {} });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?offset=2', { headers: {} });
});

test('offset paging (force page size)', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncable({
    specStr: createSpec({
    name: 'todos',
      pagingStrategy: 'offset',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      urlPath: '/todos/',
      offsetParamInQuery: 'offset',
      itemsPathInResponse: ['items'],
      forcePageSize: 2,
    }),
    syncableName: 'todos',
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly twice
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?offset=0&pageSize=2', { headers: {} });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?offset=2&pageSize=2', { headers: {} });
});

test('pageToken paging', async () => {
  const { fetchMock, mockResponses } = createFetchMock(true);

  // Call the function and assert the result
  const syncable = new Syncable({
    specStr: createSpec({
      name: 'todos',
      pagingStrategy: 'pageToken',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      urlPath: '/todos/',
      pageTokenParamInQuery: 'pageToken',
      pageTokenParamInResponse: 'nextPageToken',
      itemsPathInResponse: ['items'],
    }),
    syncableName: 'todos',
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly twice
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/', { headers: {} });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?pageToken=token1', { headers: {} });
});

test('rangeHeader paging', async () => {
  const { fetchMock, mockResponses } = createFetchMock(true);

  // Call the function and assert the result
  const syncable = new Syncable({
    specStr: createSpec({
      name: 'todos',
      pagingStrategy: 'rangeHeader',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      urlPath: '/todos/',
      pageTokenParamInQuery: 'pageToken',
      pageTokenParamInResponse: 'nextPageToken',
      itemsPathInResponse: ['items'],
      forcePageSize: 2,
    }),
    syncableName: 'todos',
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly twice
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/', { headers: { Range: 'id ..; max=2' } });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/', { headers: { Range: 'id ]2..; max=2' } });
});
