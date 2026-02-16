import { readFileSync } from 'fs';
import { components } from '../../src/types/google-calendar.js';
import { Syncable } from '../../src/syncable.js';
import { describe, it, expect } from 'vitest';
import { createFetchMock } from '../helpers/createFetchMock.js';

type Entry = components['schemas']['CalendarListEntry'];
const specFilename = './openapi/generated/google-calendar.yaml';
const specStr = readFileSync(specFilename).toString();

describe('Google Calendar List', () => {
  const { fetchMock } = createFetchMock(true);
  const syncable = new Syncable<Entry>({
    specStr,
    specFilename,
    syncableName: 'calendars',
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  it('fetches calendar list entries', async () => {
    const data = await syncable.fullFetch();
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('title');
  });
});
