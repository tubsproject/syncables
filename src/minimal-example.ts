import { readFileSync } from 'fs';
import { components } from './types/google-calendar.js';
import { Syncer } from './syncer.js';

type Entry = components['schemas']['CalendarListEntry'];
const specFilename = './openapi/generated/google-calendar.yaml';
const specStr = readFileSync(specFilename).toString();

const syncer = new Syncer({
  specStr,
  authHeaders: {
    Authorization: `Bearer ${process.env.GOOGLE_BEARER_TOKEN}`,
  },
  dbConn:
    'postgresql://syncables:syncables@localhost:5432/syncables?sslmode=disable',
});

const allTables = await syncer.fullFetch();
// Data coming out of Syncer adheres to types from .d.ts files, autocomplete works for this in VS Code, e.g.:
const calendarEntries: Entry[] = allTables.calendars as Entry[];
console.log(calendarEntries[0].backgroundColor);
