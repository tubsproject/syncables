import { test, expect } from 'vitest';
import { Syncable } from '../../src/syncable.js';
import { createSpec } from '../helpers/createSpec.js';
import { createFetchMock } from '../helpers/createFetchMock.js';

test('query', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncable(createSpec({
    name: 'todos',
    pagingStrategy: 'pageNumber',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    urlPath: '/todos/',
    pageNumberParamInQuery: 'page',
    query: { userId: '1' },
  }), 'todos', {}, fetchMock as unknown as typeof fetch);
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly once
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?userId=1&page=1', { headers: {} });
    expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?userId=1&page=2', { headers: {} });
});