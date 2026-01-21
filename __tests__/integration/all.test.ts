import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { serve } from '@hono/node-server';
import { createMockServer } from '@scalar/mock-server';
import { Syncable } from '../../src/syncable.js';

const OAD_DIR = './__tests__/integration/oad/';

describe('Syncables', async () => {
  const files = readdirSync(OAD_DIR);
  files.forEach(async (fileName) => {
    const service = fileName.split('.')[0];
    it(`can sync ${service}`, async () => {
      // Your OpenAPI document
      const document = readFileSync(`${OAD_DIR}${fileName}`).toString();
      // Create the mocked routes
      const app = await createMockServer({
        document,
        // Custom logging
        onRequest({ context, operation }) {
          console.log(
            context.req.method,
            context.req.path,
            operation.operationId,
          );
        },
      });
      // Start the server
      await new Promise((resolve) => {
        serve(
          {
            fetch: app.fetch,
            port: 3000,
          },
          (info) => {
            console.log(`Listening on http://localhost:${info.port}`);
            resolve(true);
          },
        );
      });
      const syncable = new Syncable<object>({
        specStr: document,
        specFilename: fileName,
        syncableName: 'calendarList',
        authHeaders: {
          Authorization: 'Bearer MOCK',
        },
        // baseUrl: 'http://localhost:3000',
      });
      const data = await syncable.fullFetch();
      const expected = await import(`../integration/expected/${service}.js`);
      expect(data).toEqual(expected.default);
    });
  });
});
