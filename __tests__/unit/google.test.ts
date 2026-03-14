import { readFileSync } from 'fs';
import { Syncer } from '../../src/syncer.js';
import { describe, it, expect } from 'vitest';
import { createFetchMock } from '../helpers/createFetchMock.js';
import { getSpecFromOverlay } from '../../src/utils.js';

const overlayFilename = './openapi/overlay/google-calendar-overlay.yaml';
const overlayStr = readFileSync(overlayFilename).toString();

describe('Google Calendar List', async () => {
  const { fetchMock } = createFetchMock(true);
  const specStr = await getSpecFromOverlay(overlayStr);
  console.log('overlayStr:', overlayStr);
  const syncer = new Syncer({
    specStr,
    overlayStr,
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  it('fetches calendar list entries', async () => {
    const data = await syncer.fullFetch();
    // console.log('Data fetched by syncer:', data);
    const keys = [
      // '/calendars/{calendarId}',
      '/calendars/{calendarId}/acl',
      // '/calendars/{calendarId}/acl/{ruleId}',
      '/calendars/{calendarId}/events',
      // '/calendars/{calendarId}/events/{eventId}',
      '/calendars/{calendarId}/events/{eventId}/instances',
      // '/colors',
      '/users/me/calendarList',
      // '/users/me/calendarList/{calendarId}',
      '/users/me/settings',
      // '/users/me/settings/{setting}',
    ];
    expect(Object.keys(data)).toEqual(keys);
    keys.forEach((key) => {
      expect(data[key]).toEqual([
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
      ]);
    });
  });
});
