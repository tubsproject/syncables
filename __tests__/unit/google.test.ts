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
        for (let calendarId = 1; calendarId < 4; calendarId++) {
          for (let eventId = 1; eventId < 4; eventId++) {
            for (let itemId = 1; itemId < 4; itemId++) {
              items.push({
                calendarId: calendarId.toString(),
                eventId: eventId.toString(),
                id: itemId,
                title: `Test Todo ${itemId}`,
              });
            }
          }
        }
      } else if (key.indexOf('{calendarId}') === -1) {
        for (let itemId = 1; itemId < 4; itemId++) {
          items.push({
            id: itemId,
            title: `Test Todo ${itemId}`,
          });
        }
      } else {
        for (let calendarId = 1; calendarId < 4; calendarId++) {
          for (let itemId = 1; itemId < 4; itemId++) {
            items.push({
              calendarId: calendarId.toString(),
              id: itemId,
              title: `Test Todo ${itemId}`,
            });
          }
        }
      }
      expect({ [key]: data[key] }).toEqual({ [key]: items });
    });
  });
});
