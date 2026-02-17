import { readFileSync } from 'fs';
import { Syncer } from '../../src/syncer.js';
import { describe, it, expect } from 'vitest';
import { createFetchMock } from '../helpers/createFetchMock.js';
import { Client, createSqlTable, getFields } from '../../src/db.js';
import { specStrToObj } from '../../src/syncer.js';

const googleCalendar = readFileSync('./openapi/generated/google-calendar.yaml').toString();
const moneybird = readFileSync('./openapi/generated/moneybird.yaml').toString();

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
    specStr: googleCalendar,
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
  it('can deal with items in the root', () => {
    const openApiSpec = {
      paths: {
        '/test/': {
          get: {
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
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
    };
    const fields = getFields(openApiSpec, '/test/', []);
    expect(fields).toEqual({
      id: { type: 'string' },
      name: { type: 'string' },
      value: { type: 'number' },
    });
  });
  it('can deal with nested objects', () => {
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
                          type: 'object',
                          properties: {
                            blurry: {
                              type: 'object',
                              properties: {
                                buggers: {
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
            },
          },
        },
      },
    };
    const fields = getFields(openApiSpec, '/test/', ['widgets', 'blurry', 'buggers']);
    expect(fields).toEqual({
      id: { type: 'string' },
      name: { type: 'string' },
      value: { type: 'number' },
    });
  });
  it('can deal with complex schema definitions', async () => {
    const fields = getFields(await specStrToObj(moneybird), '/administrations{format}', []);
    console.log(fields);
    expect(fields).toEqual({
      id: { allOf: [
       {
         "description": "A unique record identifier of an administration",
         "example": "123",
         "pattern": "^\\d+$",
         "type": [
           "string",
           "integer",
         ],
       },
      ] },
      name: { type: 'string', example: 'Moneybird' },
      language: {
        type: 'string',
        enum: [ 'nl', 'nl-be', 'en' ],
        example: 'nl',
        description: 'The ISO 639-1 language code used in the administration'
      },
      currency: {
        type: 'string',
        description: 'The ISO 4217 currency code',
        example: 'EUR'
      },
      country: {
        type: 'string',
        description: 'The ISO 3166-1 alpha-2 code the administration country',
        example: 'NL'
      },
      time_zone: {
        type: 'string',
        description: 'The time zone of the administration',
        example: 'Europe/Amsterdam'
      },
      access: {
        type: 'string',
        enum: [ 'accountant_company', 'user' ],
        description: 'The type of acess the user has to this administration',
        example: 'user'
      },
      suspended: { type: 'boolean' },
      period_locked_until: { type: [ 'string', 'null' ], format: 'date' },
      period_start_date: {
        type: 'string',
        format: 'date',
        description: 'Start of the year in which the administration recorded its first bookkeeping data, based on journal entries.',
        example: '2024-01-01'
      }
    });
  });
});
