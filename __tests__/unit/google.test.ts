import { readFileSync } from 'fs';
import { Syncer } from '../../src/syncer.js';
import { describe, it, expect } from 'vitest';
import { createFetchMock } from '../helpers/createFetchMock.js';

const specFilename = './openapi/oad/google-calendar.yaml';
const overlayFilename = './openapi/overlay/google-calendar-overlay.yaml';
const specStr = readFileSync(specFilename).toString();
const overlayStr = readFileSync(overlayFilename).toString();

describe('Google Calendar List', () => {
  const { fetchMock } = createFetchMock(true);
  const syncer = new Syncer({
    specStr,
    overlayStr,
    fetchFunction: fetchMock as unknown as typeof fetch,
  });
  it('fetches calendar list entries', async () => {
    const data = await syncer.fullFetch();
    // console.log('Data fetched by syncer:', data);
    expect(data).toEqual({
      acl: [
        {
          calendarId: '1',
          id: 1,
          title: 'Test Todo 1',
        },
        {
          calendarId: '1',
          id: 2,
          title: 'Test Todo 2',
        },
        {
          calendarId: '1',
          id: 3,
          title: 'Test Todo 3',
        },
        {
          calendarId: '2',
          id: 1,
          title: 'Test Todo 1',
        },
        {
          calendarId: '2',
          id: 2,
          title: 'Test Todo 2',
        },
        {
          calendarId: '2',
          id: 3,
          title: 'Test Todo 3',
        },
        {
          calendarId: '3',
          id: 1,
          title: 'Test Todo 1',
        },
        {
          calendarId: '3',
          id: 2,
          title: 'Test Todo 2',
        },
        {
          calendarId: '3',
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
          calendarId: '1',
          id: 1,
          title: 'Test Todo 1',
        },
        {
          calendarId: '1',
          id: 2,
          title: 'Test Todo 2',
        },
        {
          calendarId: '1',
          id: 3,
          title: 'Test Todo 3',
        },
        {
          calendarId: '2',
          id: 1,
          title: 'Test Todo 1',
        },
        {
          calendarId: '2',
          id: 2,
          title: 'Test Todo 2',
        },
        {
          calendarId: '2',
          id: 3,
          title: 'Test Todo 3',
        },
        {
          calendarId: '3',
          id: 1,
          title: 'Test Todo 1',
        },
        {
          calendarId: '3',
          id: 2,
          title: 'Test Todo 2',
        },
        {
          calendarId: '3',
          id: 3,
          title: 'Test Todo 3',
        },
      ],
    });
  });
});
