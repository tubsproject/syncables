import { test, expect } from 'vitest';
import { Syncer } from '../../src/syncer.js';
import { createSpec } from '../helpers/createSpec.js';
import { createFetchMock } from '../helpers/createFetchMock.js';

test('query', async () => {
  const { fetchMock, mockResponses } = createFetchMock();

  // Call the function and assert the result
  const syncable = new Syncer({
    specStr: createSpec('https://jsonplaceholder.typicode.com', {
      '/todos/': {
        name: 'todos',
        paginationStrategy: 'pageNumber',
        pageNumberParamInQuery: 'page',
        query: { userId: '1' },
        itemsPathInResponse: ['items'],
      },
    }),
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  const data = await syncable.fullFetch();
  expect(data).toEqual(mockResponses[0].items.concat(mockResponses[1].items));

  // Check that fetch was called exactly once
  expect(fetchMock).toHaveBeenCalledTimes(3);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?userId=1&page=1',
    { headers: {} },
  );
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?userId=1&page=2',
    { headers: {} },
  );
  expect(fetchMock).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/?userId=1&page=3',
    { headers: {} },
  );
});
