import { describe, it, expect } from 'vitest';
import { getDocEntry, setDocEntry } from '../../src/utils.js';
describe('get/setDocEntry', () => {
    const key = ['a', 'b', 'c'];
    const doc = {};
    it('can set and get', async () => {
        const drop = {
            tubsId: 'test',
            model: 'person',
            platformIds: {},
            properties: {},
            relations: {},
        };
        ;
        setDocEntry(doc, key, drop);
        const readBack = getDocEntry(doc, key);
        expect(readBack).toBe(drop);
    });
});
//# sourceMappingURL=getSetDocEntry.test.js.map