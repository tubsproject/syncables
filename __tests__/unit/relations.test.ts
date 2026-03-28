import { describe, it, expect, vi} from 'vitest';
import { resolveRelations } from '../../src/relations.js';

describe('resolveRelations', async () => {
  it('can resolve a single relation', async () => {
    async function callback (syncableName: string, resolution: {
      [pattern: string]: string;
    }): Promise<object[]> {
      void syncableName;
      void resolution;
      return [];
    }
    const callbackMock = vi.fn(callback);
    const result = await resolveRelations('test-syncable', {}, {}, callbackMock);
    expect(result).toEqual([]);
    expect(callbackMock).toHaveBeenCalledTimes(1);
  });
});
