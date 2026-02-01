import { describe, it, expect } from 'vitest';
import { readdirSync } from 'fs';
import { serve } from '@hono/node-server';
import { createMockServer } from '@scalar/mock-server';
import { Syncable } from '../../src/syncable.js';
import { overlayFiles, applyOverlay } from 'openapi-overlays-js/src/overlay.js';
import { parseWithPointers, safeStringify } from '@stoplight/yaml';
import { getExampleFromSchema } from '@scalar/oas-utils/spec-getters'

const OAD_DIR = './__tests__/integration/oad/';
const OVERLAY_DIR = './__tests__/integration/overlay/';

describe('Syncables', async () => {
  const files = readdirSync(OAD_DIR);
  let port = 3001;
  files.forEach(async (fileName) => {
    const service = fileName.split('.')[0];
    const thisPort = port++;

    console.log(`Considering ${service} on port ${thisPort}...`);
    if (![
      // 'acube',
      // 'arratech',
      // 'blog',
      'google-calendar',
    ].includes(service)) {
      return;
    }
    it(`can sync ${service}`, async () => {
      // Your OpenAPI document
      const overlayed = overlayFiles(`${OAD_DIR}${fileName}`, `${OVERLAY_DIR}${service}.yaml`).toString();
      const parsed = parseWithPointers(overlayed).data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const examples = [ getExampleFromSchema((parsed as any).components.schemas.CalendarListEntry) ];
      const applied = applyOverlay(parsed, {
        openapi: '3.0.0',
        info: {
          description: 'Set mock server URL',
        },
        actions: [
          {
            target: "servers['0']",
            update: {
              url: `http:/localhost:${thisPort}`,
              description: 'Local Mock Server',
            },
          },
          { target: "components.schemas.CalendarListEntry",
            update: {
              'x-seed': `seed(${JSON.stringify(examples)})`
            }
          }
        ],
      });
      const document = safeStringify(applied);

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
      let server;
      await new Promise((resolve) => {
        console.log(`Starting server for ${service} on port ${thisPort}...`);
        server = serve(
          {
            fetch: app.fetch,
            port: thisPort,
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
        syncableName: 'integrationTest',
        authHeaders: {
          Authorization: 'Bearer MOCK',
        },
      });
      const data = await syncable.fullFetch();
      const expected = await import(`../integration/expected/${service}.js`);
      for (let i = 0; i < expected.default.length; i++) {
        expect(data[i]).toEqual(expect.objectContaining(expected.default[i]));
      }
      console.log(`Stopping server for ${service}...`);
      server?.close();
    });
  });
});
