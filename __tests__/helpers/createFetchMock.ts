import { vi, Mock } from 'vitest';

export function createFetchMock(pagedByToken: boolean = false): {
  fetchMock: Mock;
  mockResponses: Array<{
    items: { [key: string]: number | string }[];
    hasMore?: boolean;
    nextPageToken?: string;
  }>;
} {
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
      items: [{ id: 3, title: 'Test Todo 3' }],
      hasMore: false,
    },
    {
      items: [],
      hasMore: false,
    },
  ];
  if (pagedByToken) {
    mockResponses[0]['nextPageToken'] = 'token1';
    delete mockResponses[0]['hasMore'];
    delete mockResponses[1]['hasMore'];
  }
  const index = {};
  return {
    mockResponses,
    fetchMock: vi.fn((url: string) => {
      url = url.split('?')[0]; // Remove pageToken for indexing
      if (!(url in index)) {
        index[url] = 0;
      }
      // console.log('Mock fetch called with URL:', url);
      return Promise.resolve({
        json: () =>
          Promise.resolve(mockResponses[index[url]++] || mockResponses[0]),
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve(''),
      });
    }),
  };
}
