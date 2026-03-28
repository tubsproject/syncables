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
      // '/colors',
      '/users/me/calendarList',
      // '/users/me/calendarList/{calendarId}',
      '/users/me/settings',
      // '/users/me/settings/{setting}',
      // '/calendars/{calendarId}',
      '/calendars/{calendarId}/acl',
      // '/calendars/{calendarId}/acl/{ruleId}',
      '/calendars/{calendarId}/events',
      // '/calendars/{calendarId}/events/{eventId}',
      '/calendars/{calendarId}/events/{eventId}/instances',
    ];
    expect(Object.keys(data)).toEqual(keys);
    keys.forEach((key) => {
      let items = [];
      if (key.indexOf('{eventId}') !== -1) {
        items = undefined;
      } else if (key.indexOf('{calendarId}') === -1) {
        for (let j = 1; j < 4; j++) {
          items.push({
            id: j,
            title: `Test Todo ${j}`,
          });
        }
      } else {
        for (let i = 1; i < 4; i++) {
          for (let j = 1; j < 4; j++) {
            items.push({
              calendarId: i.toString(),
              id: j,
              title: `Test Todo ${j}`,
            });
          }
        }
      }
      expect({ [key]: data[key] }).toEqual({ [key]: items });
    });
  });
});
