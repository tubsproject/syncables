import { describe, it, expect } from 'vitest';
import { createTubs } from '../../src/tub.js';
describe('Tub', async () => {
    const tubs = await createTubs(['one', 'two'], {
        horse: [{
                one: 'test',
                two: 'yup',
            }],
    });
    it('can fire a change event', async () => {
        const drop = {
            localId: 'test',
            model: 'cow',
            foreignIds: {},
            foo: 'bar',
            bazId: '15',
        };
        // const fired = new Promise((resolve) => {
        //   tubs[1].on('create', (drop: LocalizedDrop) => {
        //     const copied = JSON.parse(JSON.stringify(drop));
        //     copied.localId = 'localIdOnTwo';
        //     tubs[1].addObject(copied);
        //     resolve(drop);
        //   });
        // });
        tubs[0].addObject('cow', drop);
        const onOneBefore = tubs[0].getObject({ model: 'cow', localId: 'test' });
        const tubsId = onOneBefore.foreignIds.tubs;
        expect(typeof tubsId).toEqual('string');
        expect(onOneBefore).toEqual({
            localId: 'test',
            model: 'cow',
            foreignIds: {
                tubs: tubsId,
            },
            foo: 'bar',
            bazId: '15',
        });
        // const onTwo = await fired as FooDrop;
        // expect(onTwo).toEqual({
        //    bazId: undefined,
        //    foo: 'bar',
        //    foreignIds: {
        //      one: 'test',
        //      tubs: tubsId,
        //    },
        //    localId: undefined,
        //    model: 'cow',
        // });
        // const onOneAfter = tubs[0].getObject({ model: 'cow', localId: 'test' });
        // expect(onOneAfter).toEqual({
        //     localId: 'test',
        //     model: 'cow',
        //     foreignIds: {
        //       two: 'localIdOnTwo',
        //       tubs: tubsId,
        //     },
        //     foo: 'bar',
        //     bazId: '15',
        // });
    });
    it('can understand equivalences', async () => {
        const drop = {
            localId: 'test',
            model: 'horse',
            foreignIds: {},
            foo: 'bar',
            bazId: '15',
        };
        const fired = [];
        tubs[1].on('create', (drop) => {
            fired.push(drop);
        });
        tubs[0].addObject('horse', drop);
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(fired).toEqual([
            {
                foreignIds: {
                    one: 'test',
                    tubs: fired[0].foreignIds.tubs,
                },
                localId: undefined,
                model: 'cow',
                bazId: undefined,
                foo: 'bar',
            },
            {
                "foreignIds": {
                    "one": "15",
                    "tubs": fired[1].foreignIds.tubs,
                },
                "localId": undefined,
                "model": "baz",
            },
        ]);
        const onTwo = tubs[1].getObject({ model: 'horse', localId: 'yup' });
        // console.log(JSON.stringify(tubs[1].docHandle.docSync(), null, 2));
        expect(onTwo).toEqual({
            bazId: undefined,
            foo: 'bar',
            foreignIds: {
                one: 'test',
                tubs: onTwo.foreignIds.tubs,
            },
            localId: 'yup',
            model: 'horse',
        });
    });
});
//# sourceMappingURL=tub.test.js.map