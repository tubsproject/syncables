import { readFileSync } from 'fs';
import { components } from '../../src/types/google-calendar.js';
import { Syncer } from '../../src/syncer.js';
import { describe, it, expect } from 'vitest';
import { createFetchMock } from '../helpers/createFetchMock.js';

type Entry = components['schemas']['CalendarListEntry'];
const specFilename = './openapi/generated/google-calendar.yaml';
const specStr = readFileSync(specFilename).toString();

describe('Google Calendar List', () => {
  const { fetchMock } = createFetchMock(true);
  const syncer = new Syncer<Entry>({
    specStr,
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  it('fetches calendar list entries', async () => {
    const data = await syncer.fullFetch();
    // console.log('Data fetched by syncer:', data);
    expect(data).toEqual({
      acl: [
        {
          id: 1,
          title: 'Test Todo 1',
        },
        {
          id: 2,
          title: 'Test Todo 2',
        },
        {
          id: 3,
          title: 'Test Todo 3',
        },
      ],
      calendars: [
        {
          id: 1,
          title: 'Test Todo 1',
        },
        {
          id: 2,
          title: 'Test Todo 2',
        },
        {
          id: 3,
          title: 'Test Todo 3',
        },
      ],
      events: [
        {
          id: 1,
          title: 'Test Todo 1',
        },
        {
          id: 2,
          title: 'Test Todo 2',
        },
        {
          id: 3,
          title: 'Test Todo 3',
        },
      ],
    });
  });
});
