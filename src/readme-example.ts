import { readFileSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { createHash } from 'crypto';
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
  fetchFunction: async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    console.log('Fetch called with args:', input, init);
    const data = JSON.stringify([input, init]);
    const hash = createHash('sha256')
                   .update(data)
                   .digest('hex');
    try {
      const cached = await readFile(`./.fetch-cache/${hash}.json`);
      console.log('using cached response for', input);
      return new Response(cached, { status: 200 });
    } catch (err) {
      void err;
      const fetched = await fetch(input, init);
      const text = await fetched.text();
      await writeFile(`./.fetch-cache/${hash}.json`, text);
      console.log('cached response for', input);
      return new Response(text, { status: fetched.status, headers: fetched.headers });
    }
    return fetch(input, init);
  },
  dbConn: 'postgresql://syncables:syncables@localhost:5432/db_unit_tests?sslmode=disable',
});
const data = await syncable.fullFetch();
void data;
// console.log(data);
