import type { OpenAPIV3 } from '@scalar/openapi-types';
import { readFileSync } from 'fs';
import { SyncableSpec, Syncer } from '../../src/syncer.js';
import { describe, it, expect } from 'vitest';
import { createFetchMock } from '../helpers/createFetchMock.js';
import { Client, createSqlTable, getFields } from '../../src/db.js';
import { specStrToObj } from '../../src/syncer.js';

const googleCalendar = readFileSync(
  './openapi/generated/google-calendar.yaml',
).toString();
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
    const schema: OpenAPIV3.SchemaObject = {
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
    };
    const fields = getFields(schema, {
      itemsPathInResponse: ['widgets'],
    } as SyncableSpec);
    expect(fields).toEqual({
      id: { type: 'string' },
      name: { type: 'string' },
      value: { type: 'number' },
    });
  });
  it('can deal with items in the root', () => {
    const schema: OpenAPIV3.SchemaObject = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          value: { type: 'number' },
        },
      },
    };
    const fields = getFields(schema, {} as SyncableSpec);
    expect(fields).toEqual({
      id: { type: 'string' },
      name: { type: 'string' },
      value: { type: 'number' },
    });
  });
  it('can deal with nested objects', () => {
    const schema: OpenAPIV3.SchemaObject = {
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
    };
    const fields = getFields(schema, {
      itemsPathInResponse: ['widgets', 'blurry', 'buggers'],
    } as SyncableSpec);
    expect(fields).toEqual({
      id: { type: 'string' },
      name: { type: 'string' },
      value: { type: 'number' },
    });
  });
  it('can deal with complex schema definitions', async () => {
    const specObj = await specStrToObj(moneybird);
    const administrationFields = getFields(
      specObj.paths['/administrations{format}'].get.responses['200'].content[
        'application/json'
      ].schema,
      {} as SyncableSpec,
    );
    const contactFields = getFields(
      specObj.paths['/{administration_id}/contacts{format}'].get.responses[
        '200'
      ].content['application/json'].schema,
      {} as SyncableSpec,
    );
    expect(contactFields).toEqual({
      address1: {
        type: ['string', 'null'],
      },
      address2: {
        type: ['string', 'null'],
      },
      administration_id: {
        type: 'string',
      },
      archived: {
        type: 'boolean',
      },
      attention: {
        type: ['string', 'null'],
      },
      bank_account: {
        description:
          'The SEPA IBAN of the contact, can be empty if no SEPA IBAN is set',
        type: ['string', 'null'],
      },
      chamber_of_commerce: {
        type: ['string', 'null'],
      },
      city: {
        type: ['string', 'null'],
      },
      company_name: {},
      contact_people: {
        items: {
          properties: {
            administration_id: {
              type: 'string',
            },
            contact_id: {
              description: 'A unique record identifier',
              example: '458026356994737217',
              pattern: '^\\d+$',
              type: ['string', 'integer', 'null'],
            },
            created_at: {
              format: 'date-time',
              type: ['string', 'null'],
            },
            department: {
              type: ['string', 'null'],
            },
            email: {
              type: ['string', 'null'],
            },
            firstname: {
              type: ['string', 'null'],
            },
            id: {
              description: 'A unique record identifier',
              example: '458026356994737217',
              pattern: '^\\d+$',
              type: ['string', 'integer', 'null'],
            },
            lastname: {
              type: ['string', 'null'],
            },
            phone: {
              type: ['string', 'null'],
            },
            updated_at: {
              format: 'date-time',
              type: ['string', 'null'],
            },
            version: {
              type: 'integer',
            },
          },
          type: 'object',
          unevaluatedProperties: false,
        },
        type: 'array',
      },
      country: {
        type: 'string',
      },
      created_at: {
        format: 'date-time',
        type: 'string',
      },
      credit_card_number: {
        type: ['string', 'null'],
      },
      credit_card_reference: {
        type: ['string', 'null'],
      },
      credit_card_type: {
        enum: ['mastercard', 'visa', null],
        type: ['string', 'null'],
      },
      custom_fields: {
        items: {
          properties: {
            id: {
              commment:
                'Moneybird identifiers are stringified integers, so we can just treat them as strings.',
              description: 'A unique record identifier',
              example: '458026356994737217',
              pattern: '^\\d+$',
              type: 'string',
            },
            name: {
              type: 'string',
            },
            value: {
              type: 'string',
            },
          },
          type: 'object',
          unevaluatedProperties: false,
        },
        type: 'array',
      },
      customer_id: {
        description: 'Will be assigned automatically if empty',
        type: 'string',
      },
      delivery_method: {
        enum: ['Email', 'Post', 'Manual', 'Simplerinvoicing', 'Peppol', null],
        type: ['string', 'null'],
      },
      email: {
        type: ['string', 'null'],
      },
      email_ubl: {
        type: 'boolean',
      },
      estimate_workflow_id: {
        description: 'A unique record identifier',
        example: '458026356994737217',
        pattern: '^\\d+$',
        type: ['string', 'integer', 'null'],
      },
      events: {
        items: {
          properties: {
            action: {
              type: 'string',
            },
            administration_id: {
              oneOf: [
                {
                  type: 'string',
                },
                {
                  type: 'null',
                },
              ],
            },
            created_at: {
              format: 'date-time',
              type: 'string',
            },
            data: {
              additionalProperties: true,
              type: 'object',
            },
            link_entity_id: {
              description: 'A unique record identifier',
              example: '458026356994737217',
              pattern: '^\\d+$',
              type: ['string', 'integer', 'null'],
            },
            link_entity_type: {
              type: ['string', 'null'],
            },
            updated_at: {
              format: 'date-time',
              type: 'string',
            },
            user_id: {
              commment:
                'Moneybird identifiers are stringified integers, so we can just treat them as strings.',
              description: 'A unique record identifier',
              example: '458026356994737217',
              pattern: '^\\d+$',
              type: 'string',
            },
          },
          type: 'object',
          unevaluatedProperties: false,
        },
        type: 'array',
      },
      firstname: {
        type: ['string', 'null'],
      },
      id: {
        commment:
          'Moneybird identifiers are stringified integers, so we can just treat them as strings.',
        description: 'A unique record identifier',
        example: '458026356994737217',
        pattern: '^\\d+$',
        type: 'string',
      },
      invoice_workflow_id: {
        description: 'A unique record identifier',
        example: '458026356994737217',
        pattern: '^\\d+$',
        type: ['string', 'integer', 'null'],
      },
      is_trusted: {
        default: 'default',
        type: 'boolean',
      },
      lastname: {
        type: ['string', 'null'],
      },
      max_transfer_amount: {
        type: ['number', 'null'],
      },
      moneybird_payments_mandate: {
        description:
          'Whether the contact has a valid Moneybird Payments mandate',
        type: 'boolean',
      },
      notes: {
        items: {
          properties: {
            administration_id: {
              type: 'string',
            },
            assignee_id: {
              description: 'A unique record identifier',
              example: '458026356994737217',
              pattern: '^\\d+$',
              type: ['string', 'integer', 'null'],
            },
            completed_at: {
              format: 'date-time',
              type: ['string', 'null'],
            },
            completed_by_id: {
              description: 'A unique record identifier',
              example: '458026356994737217',
              pattern: '^\\d+$',
              type: ['string', 'integer', 'null'],
            },
            created_at: {
              format: 'date-time',
              type: 'string',
            },
            data: {
              type: ['object', 'null'],
            },
            entity_id: {
              description: 'A unique record identifier',
              example: '458026356994737217',
              pattern: '^\\d+$',
              type: ['string', 'integer', 'null'],
            },
            entity_type: {
              type: 'string',
            },
            id: {
              commment:
                'Moneybird identifiers are stringified integers, so we can just treat them as strings.',
              description: 'A unique record identifier',
              example: '458026356994737217',
              pattern: '^\\d+$',
              type: 'string',
            },
            note: {
              type: ['string', 'null'],
            },
            todo: {
              default: false,
              type: ['boolean', 'string', 'null'],
            },
            todo_type: {
              enum: [
                'sales_invoice_due',
                'purchase_invoice_due',
                'general_document_reminder',
                'general_document_due',
                'new_document_awaiting_processing',
                'new_financial_mutation_awaiting_processing',
                'financial_mutations_not_updated',
                'sales_invoice_payment_not_linked_to_financial_mutation',
                'document_payment_not_linked_to_financial_mutation',
                'sales_invoice_awaiting_payment_batch',
                'export_sales_invoices_ready',
                'export_documents_ready',
                'export_contacts_ready',
                'import_contacts_ready',
                'recurring_sales_invoice_auto_send_failed',
                'sales_invoice_scheduled_sending_failed',
                'sales_invoice_reminder_sending_failed',
                'sales_invoice_becoming_due',
                'sales_invoice_collecting_failed',
                'estimate_due',
                'export_estimates_ready',
                'sales_invoice_email_delivery_failed',
                'sales_invoice_email_marked_as_spam',
                'estimate_email_delivery_failed',
                'estimate_email_marked_as_spam',
                'purchase_invoice_invalid_ubl',
                'sales_invoice_unprintable',
                'estimate_unprintable',
                'auditfile_ready',
                'import_financial_statement_finished',
                'recurring_sales_invoice_auto_send_skipped_import_wizard',
                'ledger_account_report_export_ready',
                'recurring_sales_invoice_failed_deleted_contact',
                'recurring_sales_invoice_create_invoice_failed',
                'sales_invoice_simplerinvoicing_delivery_failed_unroutable',
                'purchase_invoice_received_simplerinvoicing',
                'sales_invoice_simplerinvoicing_delivery_error',
                'purchase_transaction_expired',
                'sales_invoice_si_delivery_failed_contact_unreachable',
                'sales_invoice_si_delivery_failed_deactivated',
                'sales_invoice_si_delivery_failed_identity_unverified',
                'sales_invoice_si_delivery_failed_length_exceeded',
                'recurring_document_stopped_by_contact_delete',
                'sales_invoice_email_previously_bounced',
                'estimate_email_previously_bounced',
                'email_domain_invalidated',
                'external_sales_invoice_invalid_ubl',
                'sales_invoice_email_invalid_address',
                'estimate_email_invalid_address',
                'gateway_connection_terminated',
                'sales_invoice_email_payload_too_large',
                'estimate_email_payload_too_large',
                'ponto_organization_not_activated',
                'ponto_financial_institution_deprecated',
                'contact_email_delivery_failed',
                'contact_email_marked_as_spam',
                'contact_email_previously_bounced',
                'contact_email_invalid_address',
                'contact_email_payload_too_large',
                'sales_invoice_scheduling_failed_due_to_payment_information',
                'sales_invoice_collecting_failed_missing_subscription',
                'sales_invoice_si_delivery_failed_ubl_validation_failed',
                'sales_invoice_email_sender_limit',
                'estimate_email_sender_limit',
                'contact_email_sender_limit',
                'sales_invoice_email_invalid_attachment',
                'estimate_email_invalid_attachment',
                'contact_email_invalid_attachment',
                'sales_invoice_collecting_failed_monthly_limit_exceeded',
                'adyen_verification_error',
                'contact_email_not_present',
                'financial_mutation_failed',
                'sales_invoice_si_delivery_failed_invalid_sender',
                'sales_invoice_tax_number_invalid',
                'payment_transaction_no_positive_payment',
                'financial_mutation_payment_locked',
                null,
              ],
              type: ['string', 'null'],
            },
            updated_at: {
              format: 'date-time',
              type: 'string',
            },
            user_id: {
              commment:
                'Moneybird identifiers are stringified integers, so we can just treat them as strings.',
              description: 'A unique record identifier',
              example: '458026356994737217',
              pattern: '^\\d+$',
              type: 'string',
            },
          },
          type: 'object',
          unevaluatedProperties: false,
        },
        type: 'array',
      },
      phone: {
        type: ['string', 'null'],
      },
      sales_invoices_url: {
        example:
          'https://moneybird.com/123/sales_invoices/4f0af91e456aa9c5b11ccfd6572da4f56cc8e45a701690c9279c9e4cec7b68f1/all',
        format: 'uri',
        pattern:
          '^https:\\/\\/moneybird\\.\\w{3,9}\\/\\d+\\/sales_invoices\\/[a-f0-9]{64}\\/all$',
        type: 'string',
      },
      send_estimates_to_attention: {
        type: ['string', 'null'],
      },
      send_estimates_to_email: {
        type: ['string', 'null'],
      },
      send_invoices_to_attention: {
        type: ['string', 'null'],
      },
      send_invoices_to_email: {
        type: ['string', 'null'],
      },
      sepa_active: {
        type: ['boolean', 'null'],
      },
      sepa_bic: {
        type: ['string', 'null'],
      },
      sepa_iban: {
        type: ['string', 'null'],
      },
      sepa_iban_account_name: {
        type: ['string', 'null'],
      },
      sepa_mandate_date: {
        format: 'date',
        type: ['string', 'null'],
      },
      sepa_mandate_id: {
        type: ['string', 'null'],
      },
      sepa_sequence_type: {
        enum: ['RCUR', 'FRST', 'OOFF', 'FNAL'],
        type: 'string',
      },
      si_identifier: {
        type: ['string', 'null'],
      },
      si_identifier_type: {
        type: ['string', 'null'],
      },
      tax_number: {
        type: ['string', 'null'],
      },
      tax_number_valid: {
        type: ['boolean', 'null'],
      },
      tax_number_validated_at: {
        format: 'date-time',
        type: ['string', 'null'],
      },
      updated_at: {
        format: 'date-time',
        type: 'string',
      },
      version: {
        example: 1716801778,
        type: 'integer',
      },
      zipcode: {
        type: ['string', 'null'],
      },
    });
    expect(administrationFields).toEqual({
      id: {
        type: 'string',
        // allOf: [
        //  {
        //    "description": "A unique record identifier of an administration",
        //    "example": "123",
        //    "pattern": "^\\d+$",
        //    "type": [
        //      "string",
        //      "integer",
        //    ],
        //  },
        // ]
      },
      name: { type: 'string', example: 'Moneybird' },
      language: {
        type: 'string',
        enum: ['nl', 'nl-be', 'en'],
        example: 'nl',
        description: 'The ISO 639-1 language code used in the administration',
      },
      currency: {
        type: 'string',
        description: 'The ISO 4217 currency code',
        example: 'EUR',
      },
      country: {
        type: 'string',
        description: 'The ISO 3166-1 alpha-2 code the administration country',
        example: 'NL',
      },
      time_zone: {
        type: 'string',
        description: 'The time zone of the administration',
        example: 'Europe/Amsterdam',
      },
      access: {
        type: 'string',
        enum: ['accountant_company', 'user'],
        description: 'The type of acess the user has to this administration',
        example: 'user',
      },
      suspended: { type: 'boolean' },
      period_locked_until: { type: ['string', 'null'], format: 'date' },
      period_start_date: {
        type: 'string',
        format: 'date',
        description:
          'Start of the year in which the administration recorded its first bookkeeping data, based on journal entries.',
        example: '2024-01-01',
      },
    });
  });
  it('can deal with item-type syncables', async () => {
    const specObj = await specStrToObj(moneybird);
    const defaultIdentityFields = getFields(
      specObj.paths['/{administration_id}/identities/default{format}'].get
        .responses['200'].content['application/json'].schema,
      specObj.paths['/{administration_id}/identities/default{format}'].get
        .responses['200'].content['application/json']
        .syncables[0] as SyncableSpec,
    );
    expect(defaultIdentityFields).toEqual({
      address1: {
        type: ['string', 'null'],
      },
      address2: {
        type: ['string', 'null'],
      },
      administration_id: {
        type: 'string',
      },
      bank_account_bic: {
        type: ['string', 'null'],
      },
      bank_account_name: {
        type: ['string', 'null'],
      },
      bank_account_number: {
        type: ['string', 'null'],
      },
      chamber_of_commerce: {
        type: ['string', 'null'],
      },
      city: {
        type: ['string', 'null'],
      },
      company_name: {
        type: ['string', 'null'],
      },
      country: {
        type: ['string', 'null'],
      },
      created_at: {
        format: 'date-time',
        type: 'string',
      },
      custom_fields: {
        items: {
          properties: {
            id: {
              commment:
                'Moneybird identifiers are stringified integers, so we can just treat them as strings.',
              description: 'A unique record identifier',
              example: '458026356994737217',
              pattern: '^\\d+$',
              type: 'string',
            },
            name: {
              type: 'string',
            },
            value: {
              type: 'string',
            },
          },
          type: 'object',
          unevaluatedProperties: false,
        },
        type: 'array',
      },
      email: {
        type: ['string', 'null'],
      },
      id: {
        commment:
          'Moneybird identifiers are stringified integers, so we can just treat them as strings.',
        description: 'A unique record identifier',
        example: '458026356994737217',
        pattern: '^\\d+$',
        type: 'string',
      },
      phone: {
        type: ['string', 'null'],
      },
      tax_number: {
        type: ['string', 'null'],
      },
      updated_at: {
        format: 'date-time',
        type: 'string',
      },
      zipcode: {
        type: ['string', 'null'],
      },
    });
  });
});
