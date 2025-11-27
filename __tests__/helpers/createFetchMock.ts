import { vi } from 'vitest';

export function createFetchMock(pagedByToken: boolean = false) {
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
        { id: 3, title: 'Test Todo 3' },
      ],
      hasMore: false,
    },
  ];
  if (pagedByToken) {
    mockResponses[0]['nextPageToken'] = 'token1';
    delete mockResponses[0]['hasMore'];
    delete mockResponses[1]['hasMore'];
  }
  let index = 0;
  return {
    mockResponses,
    fetchMock: vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponses[index++]),
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(''),
      })
    ),
  }
}