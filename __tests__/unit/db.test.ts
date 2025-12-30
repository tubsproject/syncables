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
    const before = await client.query(`select count(*) from pg_tables where tablename='calendarlist';`);
    expect(before.rows[0].count).toEqual('0');
    await syncable.fullFetch();

    const after = await client.query(`select count(*) from pg_tables where tablename='calendarlist';`);
    // await new Promise((resolve) => setTimeout(resolve, 500)); // wait for a bit to ensure data is committed
    expect(after.rows[0].count).toEqual('1');
    const data = await client.query('SELECT * FROM "calendarlist";');
    expect(data.rows.length).toBeGreaterThan(0);
    expect(data.rows[0]).toHaveProperty('Sid');
    expect(data.rows[0]).toHaveProperty('SforegroundColor');
  });
});
