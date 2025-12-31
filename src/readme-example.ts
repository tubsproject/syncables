import { readFileSync } from 'fs';
import { components } from './types/google-calendar.js';
import { Syncable } from './syncable.js';

type Entry = components['schemas']['CalendarListEntry'];
const specStr = readFileSync(
  './openapi/generated/google-calendar.yaml',
).toString();

const syncable = new Syncable<Entry>({
  specStr,
  syncableName: 'widgets',
  authHeaders: {
    Authorization: `Bearer ${process.env.GOOGLE_BEARER_TOKEN}`,
  },
  dbConn: 'postgresql://syncables:syncables@localhost:5432/db_unit_tests',
});
const data = await syncable.fullFetch();
console.log(data);
