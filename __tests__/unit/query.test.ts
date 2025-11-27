import { test, vi, expect } from 'vitest';
import { Syncable } from '../../src/syncable.js';
import { createSpec } from '../helpers/createSpec.js';

test('query', async () => {
  // Mock the fetch function.
  const mockResponse = {
    items: [
    { id: 1, title: 'Test Todo 1' },
    ],
    hasMore: false,
  };
  const fetchMock = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockResponse),
    }),
  );

  // Call the function and assert the result
  const syncable = new Syncable(createSpec({
    name: 'todos',
    pagingStrategy: 'pageNumber',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    urlPath: '/todos/',
    pageNumberParamInQuery: 'page',
    query: { userId: '1' },
  }), 'todos', fetchMock as unknown as typeof fetch);
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponse.items);

  // Check that fetch was called exactly once
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?userId=1&page=1');
});