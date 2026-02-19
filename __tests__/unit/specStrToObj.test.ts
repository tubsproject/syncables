import { describe, it, expect } from 'vitest';
import { readSpec, specStrToObj } from '../../src/utils.js';
import { createSpec } from '../helpers/createSpec.js';

describe('specStrToObj', async () => {
  it('applies the overlay before dereferencing', async () => {
    const specStr = createSpec('https://example.com', {});
    const overlayStr = `openapi: 3.0.0
info:
  description: Add syncables to the Ion Peppol API.
actions:
- target: components.schemas
  update:
    CreateWebhook:
      description: FIXME
    UpdateWebhook:
      description: FIXME
`;
    const doc = await specStrToObj(specStr, overlayStr);
    console.log('Result of specStrToObj with overlay', JSON.stringify(doc, null, 2));
    expect(doc).toEqual({
      "components": {
        "schemas": {
          "CreateWebhook": {
            "description": "FIXME"
          },
          "UpdateWebhook": {
            "description": "FIXME"
          },
        },
      },
      "info": {
        "title": "Test API",
        "version": "1.0.0",
      },
      "openapi": "3.0.0",
      "paths": {},
      "servers": [
        {
          "url": "https://example.com",
        },
      ],
    });
  });
  it('can parse the arratech-peppol spec + overlay', async () => {
    const specStr = await readSpec('spec', 'arratech-peppol');
    const overlayStr = await readSpec('overlay', 'arratech-peppol');
    const doc = await specStrToObj(specStr, overlayStr);
    expect(doc.components.schemas.CreateWebhook).toBeDefined();
  });
});
