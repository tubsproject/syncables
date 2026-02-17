import { readFileSync } from 'fs';
import { Syncer } from '../../src/syncer.js';
import { describe, it, expect } from 'vitest';
import { createFetchMock } from '../helpers/createFetchMock.js';
import { Client, createSqlTable, getFields } from '../../src/db.js';

const specFilename = './openapi/generated/google-calendar.yaml';
const specStr = readFileSync(specFilename).toString();

describe('Google Calendar List', async () => {
  const { fetchMock } = createFetchMock(true);
  const dbConn =
    'postgresql://syncables:syncables@localhost:5432/db_unit_tests?sslmode=disable';
  const client = new Client({
    connectionString: dbConn,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();
  const syncable = new Syncer({
    specStr,
    authHeaders: {},
    fetchFunction: fetchMock as unknown as typeof fetch,
    dbConn,
  });
  it('stores calendar list entries in the db', async () => {
    await client.query('DROP TABLE IF EXISTS calendars;');
    const before = await client.query(
      `select count(*) from pg_tables where tablename='calendars';`,
    );
    expect(before.rows[0].count).toEqual('0');
    await syncable.fullFetch();

    const after = await client.query(
      `select count(*) from pg_tables where tablename='calendars';`,
    );
    // await new Promise((resolve) => setTimeout(resolve, 500)); // wait for a bit to ensure data is committed
    expect(after.rows[0].count).toEqual('1');
    const data = await client.query('SELECT * FROM "calendars";');
    expect(data.rows.length).toBeGreaterThan(0);
    expect(data.rows[0]).toHaveProperty('Sid');
    expect(data.rows[0]).toHaveProperty('SforegroundColor');
  });
  it('creates a SQL table based on the Google Calendar ListEntry schema', async () => {
    const whatWeWant = {
      id: { type: 'string' },
      summary: { type: 'string' },
      description: { type: 'string' },
      etag: { type: 'string' },
      foregroundColor: { type: 'string' },
      backgroundColor: { type: 'string' },
      selected: { type: 'boolean' },
      accessRole: { type: 'string' },
      defaultReminders: { type: 'string' },
      notificationSettings: { type: 'string' },
      primary: { type: 'boolean' },
      deleted: { type: 'boolean' },
    };
    await client.query('DROP TABLE IF EXISTS test_calendars;');
    await createSqlTable(client, 'test_calendars', whatWeWant, 'id', {
      userId: 'string',
    });
    const tableExists = await client.query(
      `select count(*) from pg_tables where tablename='test_calendars';`,
    );
    expect(tableExists.rows[0].count).toEqual('1');
    const tableInfo = await client.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'test_calendars';`,
    );
    const columns: { [key: string]: string } = {};
    tableInfo.rows.forEach((row) => {
      columns[row.column_name] = row.data_type;
    });
    expect(columns['Sid']).toEqual('text');
    expect(columns['Sselected']).toEqual('boolean');
    expect(columns['SforegroundColor']).toEqual('text');
    expect(columns['SuserId']).toEqual('text');
  });
});

describe('getFields', () => {
  it('retrieves the correct fields from the OpenAPI spec', () => {
    const openApiSpec = {
      paths: {
        '/test/': {
          get: {
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        widgets: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string' },
                              name: { type: 'string' },
                              value: { type: 'number' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    const fields = getFields(openApiSpec, '/test/', ['widgets']);
    expect(fields).toEqual({
      id: { type: 'string' },
      name: { type: 'string' },
      value: { type: 'number' },
    });
  });
});
