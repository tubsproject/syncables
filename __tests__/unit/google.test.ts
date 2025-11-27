import { readFileSync } from 'fs';
import { components } from '../../src/types/google-calendar.js';
import { Syncable } from '../../src/syncable.js';
import { describe, it, expect, vi } from 'vitest';

type Entry = components['schemas']['CalendarListEntry'];
const specStr = readFileSync('./openapi/generated/google-calendar.yaml').toString();

describe('Google Calendar List', () => {
    // Mock the fetch function.
  const mockResponses = [
    {
      items: [
        { id: 1, title: 'Test Todo 1' },
        { id: 2, title: 'Test Todo 2' },
      ],
      nextPageToken: 'tokn1',
    },
    {
      items: [
        { id: 1, title: 'Test Todo 3' },
      ],
      nextPageToken: null,
    },
  ];
  let index = 0;
  const fetchMock = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockResponses[index++]),
    }),
  );
  const syncable = new Syncable<Entry>(specStr, 'calendarList', fetchMock as unknown as typeof fetch);
  it('fetches calendar list entries', async () => {
    const data = await syncable.fullFetch();
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
  });
});
