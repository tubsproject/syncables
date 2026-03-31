import { describe, it, expect, vi } from 'vitest';
import { resolveRelations } from '../../src/relations.js';
import { TypedObject } from '../../src/schemaStore.js';

describe('resolveRelations', async () => {
  it('can resolve an empty collection with no relations', async () => {
    async function callback(
      syncableName: string,
      resolution: {
        [pattern: string]: string;
      },
    ): Promise<TypedObject> {
      void syncableName;
      void resolution;
      return { data: [], schema: {} };
    }
    const callbackMock = vi.fn(callback);
    const result = await resolveRelations(
      ['test-syncable'],
      {},
      {},
      callbackMock,
    );
    expect(result).toEqual({ 'test-syncable': { data: [], schema: undefined } });
    expect(callbackMock).toHaveBeenCalledTimes(1);
  });
  it('can resolve a filled collection with no relations', async () => {
    const items = [
      { id: 1, foo: 'bar' },
      { id: 2, foo: 'baz' },
    ];
    async function callback(
      syncableName: string,
      resolution: {
        [pattern: string]: string;
      },
    ): Promise<TypedObject> {
      void syncableName;
      void resolution;
      return { data: items, schema: undefined };
    }
    const callbackMock = vi.fn(callback);
    const result = await resolveRelations(
      ['test-syncable'],
      {},
      {},
      callbackMock,
    );
    expect(result).toEqual({ 'test-syncable': { data: items, schema: undefined } });
    expect(callbackMock).toHaveBeenCalledTimes(1);
  });
  it('can resolve a single relation', async () => {
    const groups = [
      { id: 1, name: 'bears' },
      { id: 2, name: 'bees' },
    ];
    const items = [
      { id: 1, groupId: 1, foo: 'bar' },
      { id: 2, groupId: 2, foo: 'baz' },
      { id: 3, groupId: 3, foo: 'no' },
    ];
    async function callback(
      syncableName: string,
      resolution: {
        [pattern: string]: string;
      },
    ): Promise<TypedObject> {
      void resolution;
      if (syncableName === '/groups') {
        return { data: groups, schema: undefined };
      }
      // console.log('filtering items', items, resolution);
      return {
        data: items.filter((item) => {
          // console.log('comparing', item.groupId.toString(), resolution['groupId'], item.groupId.toString() === resolution['groupId']?.toString());
          return item.groupId.toString() === resolution['groupId']?.toString();
        }),
        schema: {},
      };
    }
    const callbackMock = vi.fn(callback);
    // console.log('starting round 1');
    const round1 = await resolveRelations(
      ['/groups', '/{groupId}/items'],
      {
        groupId: '/groups#id',
      },
      {},
      callbackMock,
    );
    expect(round1).toEqual({
      '/groups': { data: groups, schema: undefined },
    });
    // console.log('starting round 2');
    const round2 = await resolveRelations(
      ['/groups', '/{groupId}/items'],
      {
        groupId: '/groups#id',
      },
      round1,
      callbackMock,
    );
    // console.log(JSON.stringify(round2, null, 2));
    expect(round2).toEqual({
      '/{groupId}/items': {
        data: items.filter((item) => item.id < 3),
        schema: undefined,
      },
    });
    expect(callbackMock.mock.calls).toEqual([
      ['/groups', {}],
      [
        '/{groupId}/items',
        {
          groupId: 1,
        },
      ],
      [
        '/{groupId}/items',
        {
          groupId: 2,
        },
      ],
    ]);
  });
  it('can resolve a nested relation', async () => {
    const groups = [
      { id: 1, name: 'bears' },
      { id: 2, name: 'bees' },
    ];
    const trips = [
      { id: 'w', groupId: 1, destination: 'woods' },
      { id: 'm', groupId: 1, destination: 'mountains' },
      { id: 'f', groupId: 2, destination: 'field' },
      { id: 'r', groupId: 2, destination: 'river' },
    ];
    const items = [
      { id: 1, tripId: 'w', foo: 'bar' },
      { id: 2, tripId: 'w', foo: 'baz' },
      { id: 3, tripId: 'f', foo: 'bar' },
      { id: 4, tripId: 'r', foo: 'baz' },
    ];
    async function callback(
      syncableName: string,
      resolution: {
        [pattern: string]: string;
      },
    ): Promise<TypedObject> {
      void resolution;
      if (syncableName === '/groups') {
        return { data: groups, schema: {} };
      }
      if (syncableName === '/groups/{groupId}/trips') {
        // console.log('filtering trips', resolution);
        return {
          data: trips.filter(
            (trip) =>
              trip.groupId.toString() === resolution['groupId']?.toString(),
          ),
          schema: {},
        };
      }
      if (syncableName === '/groups/{groupId}/trips/{tripId}/items') {
        // console.log('filtering items on trips', resolution);
        return {
          data: items.filter(
            (item) =>
              item.tripId.toString() === resolution['tripId']?.toString(),
          ),
          schema: {},
        };
      }
      throw new Error(`unanticipated request: ${syncableName}`);
    }
    const rounds = [
      {
        results: {
          '/groups': { data: groups, schema: undefined },
        },
        calls: [['/groups', {}]],
      },
      {
        results: {
          '/groups/{groupId}/trips': { data: trips, schema: undefined },
        },
        calls: [
          [
            '/groups/{groupId}/trips',
            {
              groupId: 1,
            },
          ],
          [
            '/groups/{groupId}/trips',
            {
              groupId: 2,
            },
          ],
        ],
      },
      {
        results: {
          '/groups/{groupId}/trips/{tripId}/items': {
            data: [items[0], items[1]],
            schema: undefined,
          },
        },
        calls: [
          [
            '/groups/{groupId}/trips/{tripId}/items',
            {
              groupId: 1,
              tripId: 'w',
            },
          ],
          [
            '/groups/{groupId}/trips/{tripId}/items',
            {
              groupId: 1,
              tripId: 'm',
            },
          ],
          [
            '/groups/{groupId}/trips/{tripId}/items',
            {
              groupId: 2,
              tripId: 'm',
            },
          ],
        ],
      },
    ];
    const data = {};
    for (let i = 0; i < 3; i++) {
      const callbackMock = vi.fn(callback);
      const result = await resolveRelations(
        [
          '/groups',
          '/groups/{groupId}/trips',
          '/groups/{groupId}/trips/{tripId}/items',
        ],
        {
          groupId: '/groups#id',
          tripId: '/groups/{groupId}/trips#id',
        },
        data,
        callbackMock,
      );
      Object.keys(result).forEach((syncableName) => {
        data[syncableName] = {
          data: ((data[syncableName]?.data as object[]) || []).concat(result[syncableName].data),
          schema: data[syncableName]?.schema,
        };
      });
      expect(result).toEqual(rounds[i].results);
      expect(callbackMock.mock.calls).toEqual(rounds[i].calls);
    }
  });
});
