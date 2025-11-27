import { readFileSync } from 'fs';
import { components } from './types/google-calendar.js';
import { Syncable } from './syncable.js';

type Entry = components['schemas']['CalendarListEntry'];
const specStr = readFileSync(
  './openapi/generated/google-calendar.yaml',
).toString();

const syncable = new Syncable<Entry>(specStr, 'calendarList');
const data = await syncable.fullFetch();
console.log(data);
