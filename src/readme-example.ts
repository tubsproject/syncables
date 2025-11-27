import { readFileSync } from 'fs';
import { components } from './types/google-calendar.js';
import { Syncable } from './syncable.js';

type Entry = components['schemas']['CalendarListEntry'];
const specStr = readFileSync(
  './openapi/generated/google-calendar.yaml',
).toString();

const syncable = new Syncable<Entry>(specStr, 'calendarList', {
  Authorization: `Bearer ${process.env.GOOGLE_BEARER_TOKEN}`,
});
const data = await syncable.fullFetch();
console.log(data);
