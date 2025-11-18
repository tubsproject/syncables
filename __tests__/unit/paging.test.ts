import { test, vi, expect } from 'vitest';
import { Syncable } from '../../src/syncable.js';

test('fetches data successfully from API', async () => {
  // Mock the fetch function.
  const mockResponse = {
    userId: 1,
    id: 1,
    title: 'Test Todo',
    completed: false,
  };
  const fetchMock = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockResponse),
    }),
  );

  // Call the function and assert the result
  const syncable = new Syncable(fetchMock as unknown as typeof fetch);
  const data = await syncable.run();
  expect(data).toEqual(mockResponse);

  // Check that fetch was called exactly once
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/1');
});
