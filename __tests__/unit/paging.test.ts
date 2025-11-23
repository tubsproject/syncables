import { test, vi, expect } from 'vitest';
import { Syncable } from '../../src/syncable.js';

test('fetches data successfully from API', async () => {
  // Mock the fetch function.
  const mockResponses = [
    {
      items: [
        { id: 1, title: 'Test Todo 1' },
        { id: 2, title: 'Test Todo 2' },
      ],
      hasMore: true,
    },
    {
      items: [
        { id: 1, title: 'Test Todo 3' },
      ],
      hasMore: false,
    },
  ];
  let index = 0;
  const fetchMock = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockResponses[index++]),
    }),
  );

  // Call the function and assert the result
  const syncable = new Syncable({
    pagingStrategy: 'pageNumber',
    listUrl: 'https://jsonplaceholder.typicode.com/todos/',
  }, fetchMock as unknown as typeof fetch);
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly once
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?page=1');
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/?page=2');
});
