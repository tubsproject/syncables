import { describe, it, expect } from 'vitest';
import {
  getSpecFromOverlay,
  readSpec,
  specStrToObj,
  findPathParts,
} from '../../src/utils.js';
import { createSpec } from '../helpers/createSpec.js';
import { OpenAPIV3_1 } from '@scalar/openapi-types';

describe('specStrToObj', async () => {
  it('applies the overlay before dereferencing', async () => {
    const specStr = createSpec(
      'https://example.com',
      {},
      { paginate: '' },
      { parameters: {} },
    );
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
    // console.log(
    //   'Result of specStrToObj with overlay',
    //   JSON.stringify(doc, null, 2),
    // );
    expect(doc).toEqual({
      components: {
        schemas: {
          CreateWebhook: {
            description: 'FIXME',
          },
          UpdateWebhook: {
            description: 'FIXME',
          },
        },
        paginationSchemes: {
          default: {
            paginate: '',
          },
        },
      },
      relations: {
        parameters: {},
      },
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      openapi: '3.0.0',
      paths: {},
      servers: [
        {
          url: 'https://example.com',
        },
      ],
    });
  });
  it('can parse the arratech-peppol spec + overlay', async () => {
    const overlayStr = await readSpec('overlay', 'arratech-peppol');
    const specStr = await getSpecFromOverlay(overlayStr);
    const doc = await specStrToObj(specStr, overlayStr);
    expect(doc.components.schemas.CreateWebhook).toBeDefined();
  });
});

describe('findPathParts', () => {
  const schemaRoot: OpenAPIV3_1.SchemaObject = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
    },
  };
  const schemaItems: OpenAPIV3_1.SchemaObject = {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
  };
  const schemaFooBar: OpenAPIV3_1.SchemaObject = {
    type: 'object',
    properties: {
      foo: {
        type: 'object',
        properties: {
          bar: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
            },
          },
        },
      },
    },
  };
  it('throws an error if the parameter name has an empty part', () => {
    expect(() => findPathParts(['items', '', 'id'], schemaItems)).toThrowError(
      'Invalid parameter name with empty part: items..id',
    );
  });
  it('finds path parts in a root array schema', () => {
    expect(findPathParts([], schemaRoot)).toBe(true);
  });
  it('finds path parts in a first-level array schema', () => {
    expect(findPathParts(['items'], schemaItems)).toBe(true);
  });
  it('returns false if path parts are not found', () => {
    expect(findPathParts(['items', 'name'], schemaItems)).toBe(false);
  });
  it('finds path parts in a nested schema', () => {
    expect(findPathParts(['foo', 'bar'], schemaFooBar)).toBe(true);
  });
});
