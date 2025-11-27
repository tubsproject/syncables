import { createSpec } from '../helpers/createSpec.js';
import { createFetchMock } from '../helpers/createFetchMock.js';
import { test, expect } from 'vitest';
import { Syncable } from '../../src/syncable.js';

test('pageNumber paging', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncable(createSpec({
    name: 'todos',
    pagingStrategy: 'pageNumber',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    urlPath: '/todos/',
    pageNumberParamInQuery: 'page',
  }), 'todos', {}, fetchMock as unknown as typeof fetch);
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly once
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?page=1', { headers: {} });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?page=2', { headers: {} });
});

test('offset paging', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncable(createSpec({
    name: 'todos',
    pagingStrategy: 'offset',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    urlPath: '/todos/',
    offsetParamInQuery: 'offset',
  }), 'todos', {}, fetchMock as unknown as typeof fetch);
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly once
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?offset=0', { headers: {} });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?offset=2', { headers: {} });
});

test('pageToken paging', async () => {
  const { fetchMock, mockResponses } = createFetchMock(true);

  // Call the function and assert the result
  const syncable = new Syncable(createSpec({
    name: 'todos',
    pagingStrategy: 'pageToken',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    urlPath: '/todos/',
    pageTokenParamInQuery: 'pageToken',
    pageTokenParamInResponse: 'nextPageToken',
  }), 'todos', {}, fetchMock as unknown as typeof fetch);
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly once
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/', { headers: {} });
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?pageToken=token1', { headers: {} });
});
