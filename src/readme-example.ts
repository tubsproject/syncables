import { readFileSync } from 'fs';
import { components } from './types/google-calendar.js';
import { Syncable } from './syncable.js';

type Entry = components['schemas']['CalendarListEntry'];
const specFilename = './openapi/generated/google-calendar.yaml';
const specStr = readFileSync(specFilename).toString();

const syncable = new Syncable<Entry>({
  specStr,
  specFilename,
  syncableName: 'calendarList',
  authHeaders: {
    Authorization: `Bearer ${process.env.GOOGLE_BEARER_TOKEN}`,
  },
  dbConn: 'postgresql://syncables:syncables@localhost:5432/db_unit_tests?sslmode=disable',
});
const data = await syncable.fullFetch();
console.log(data);
