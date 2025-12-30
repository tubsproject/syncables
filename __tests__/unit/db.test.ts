import { readFileSync } from 'fs';
import { components } from '../../src/types/google-calendar.js';
import { Syncable } from '../../src/syncable.js';
import { describe, it, expect } from 'vitest';
import { createFetchMock } from '../helpers/createFetchMock.js';
import { Client } from '../../src/db.js';

type Entry = components['schemas']['CalendarListEntry'];
const specStr = readFileSync('./openapi/generated/google-calendar.yaml').toString();

describe('Google Calendar List', async () => {
  const { fetchMock } = createFetchMock(true);
  const dbConn = 'postgresql://syncables:syncables@localhost:5432/db_unit_tests?sslmode=disable';
  const client = new Client({
    connectionString: dbConn,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();
  const syncable = new Syncable<Entry>({
    specStr,
    syncableName: 'calendarList',
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
    dbConn,
  });
  it('stores calendar list entries in the db', async () => {
    await client.query('DROP TABLE IF EXISTS calendarList;');
    const before = await client.query(`select count(*) from pg_tables where tablename='calendarList';`);
    expect(before.rows[0].count).toEqual('0');
    await syncable.fullFetch();

    const after = await client.query(`select count(*) from pg_tables where tablename='calendarList';`);
    // expect(after.rows[0].count).toEqual('1');
    // const data = await client.query('SELECT * FROM "calendarList";');
    // expect(data.length).toBeGreaterThan(0);
    // expect(data[0]).toHaveProperty('id');
    // expect(data[0]).toHaveProperty('title');
  });
});
