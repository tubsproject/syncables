import { describe, it, expect, vi} from 'vitest';
import { resolveRelations } from '../../src/relations.js';

describe('resolveRelations', async () => {
  it('can resolve an empty collection with no relations', async () => {
    async function callback (syncableName: string, resolution: {
      [pattern: string]: string;
    }): Promise<object[]> {
      void syncableName;
      void resolution;
      return [];
    }
    const callbackMock = vi.fn(callback);
    const result = await resolveRelations(['test-syncable'], {}, {}, callbackMock);
    expect(result).toEqual({ 'test-syncable': [] });
    expect(callbackMock).toHaveBeenCalledTimes(1);
  });
  it('can resolve a filled collection with no relations', async () => {
    const items = [
      { id: 1, foo: 'bar', },
      { id: 2, foo: 'baz', },
    ];
    async function callback (syncableName: string, resolution: {
      [pattern: string]: string;
    }): Promise<object[]> {
      void syncableName;
      void resolution;
      return items;
    }
    const callbackMock = vi.fn(callback);
    const result = await resolveRelations(['test-syncable'], {}, {}, callbackMock);
    expect(result).toEqual({ 'test-syncable': items });
    expect(callbackMock).toHaveBeenCalledTimes(1);
  });
  it('can resolve a single relation', async () => {
    const groups = [
      { id: 1, name: 'bears', },
      { id: 2, name: 'bees', },
    ];
    const items = [
      { id: 1, groupId: 1, foo: 'bar', },
      { id: 2, groupId: 2, foo: 'baz', },
      { id: 3, groupId: 3, foo: 'no', },
    ];
    async function callback (syncableName: string, resolution: {
      [pattern: string]: string;
    }): Promise<object[]> {
      void resolution;
      if (syncableName === '/groups') {
        return groups;
      }
      // console.log('filtering items', items, resolution);
      return items.filter(item => {
        // console.log('comparing', item.groupId.toString(), resolution['groupId'], item.groupId.toString() === resolution['groupId']?.toString());
        return item.groupId.toString() === resolution['groupId']?.toString();
      });
    }
    const callbackMock = vi.fn(callback);
    // console.log('starting round 1');
    const round1 = await resolveRelations(['/groups', '/{groupId}/items'], {
      groupId: {
        collection: '/groups',
        field: 'id',
      },
    }, {
    }, callbackMock);
    expect(round1).toEqual({
      '/groups': groups,
    });
    // console.log('starting round 2');
    const round2 = await resolveRelations(['/groups', '/{groupId}/items'], {
      groupId: {
        collection: '/groups',
        field: 'id',
      },
    }, round1, callbackMock);
    // console.log(JSON.stringify(round2, null, 2));
    expect(round2).toEqual({
      '/{groupId}/items': items.filter(item => item.id < 3)
    });
    expect(callbackMock.mock.calls).toEqual([
      [
        "/groups",
        {
        },
      ],
      [
        "/{groupId}/items",
        {
          "groupId": 1,
        },
      ],
      [
        "/{groupId}/items",
        {
          "groupId": 2,
        },
      ],
    ]);
  });
  it.only('can resolve a nested relation', async () => {
    const groups = [
      { id: 1, name: 'bears', },
      { id: 2, name: 'bees', },
    ];
    const trips = [
      { id: 'w', groupId: 1, destination: 'woods', },
      { id: 'm', groupId: 1, destination: 'mountains', },
      { id: 'f', groupId: 2, destination: 'field' },
      { id: 'r', groupId: 2, destination: 'river' },
    ];
    const items = [
      { id: 1, tripId: 'w', foo: 'bar', },
      { id: 2, tripId: 'w', foo: 'baz', },
      { id: 3, tripId: 'f', foo: 'bar', },
      { id: 4, tripId: 'r', foo: 'baz', },
    ];
    async function callback (syncableName: string, resolution: {
      [pattern: string]: string;
    }): Promise<object[]> {
      void resolution;
      if (syncableName === 'groups') {
        return groups;
      }
      if (syncableName === 'trips') {
        // console.log('filtering trips', resolution);
        return trips.filter(trip => trip.groupId.toString() === resolution['groups']);
      }
      // console.log('filtering items on trips', resolution);
      return items.filter(item => item['tripId'].toString() === resolution['trips']);
    }
    const rounds = [
      {
        results: {
          "/groups": [],
          "/groups/{groupId}/trips": [],
          "/groups/{groupId}/trips/{tripId}/items": [],
        },
        calls: [
          [
            "/groups",
            {
              "groupId": 1,
              "tripId": "w",
            },
          ],
          [
            "/groups",
            {
              "groupId": 1,
              "tripId": "m",
            },
          ],
          [
            "/groups",
            {
              "groupId": 1,
              "tripId": "f",
            },
          ],
          [
            "/groups",
            {
              "groupId": 1,
              "tripId": "r",
            },
          ],
          [
            "/groups",
            {
              "groupId": 2,
              "tripId": "r",
            },
          ],
          [
            "/groups/{groupId}/trips",
            {
              "groupId": 1,
              "tripId": "w",
            },
          ],
          [
            "/groups/{groupId}/trips",
            {
              "groupId": 1,
              "tripId": "m",
            },
          ],
          [
            "/groups/{groupId}/trips",
            {
              "groupId": 1,
              "tripId": "f",
            },
          ],
          [
            "/groups/{groupId}/trips",
            {
              "groupId": 1,
              "tripId": "r",
            },
          ],
          [
            "/groups/{groupId}/trips",
            {
              "groupId": 2,
              "tripId": "r",
            },
          ],
          [
            "/groups/{groupId}/trips/{tripId}/items",
            {
              "groupId": 1,
              "tripId": "w",
            },
          ],
          [
            "/groups/{groupId}/trips/{tripId}/items",
            {
              "groupId": 1,
              "tripId": "m",
            },
          ],
          [
            "/groups/{groupId}/trips/{tripId}/items",
            {
              "groupId": 1,
              "tripId": "f",
            },
          ],
          [
            "/groups/{groupId}/trips/{tripId}/items",
            {
              "groupId": 1,
              "tripId": "r",
            },
          ],
          [
            "/groups/{groupId}/trips/{tripId}/items",
            {
              "groupId": 2,
              "tripId": "r",
            },
          ],
          [
            "/groups",
            {
              "groupId": 1,
            },
          ],
          [
            "/groups/{groupId}/trips",
            {
              "groupId": 1,
            },
          ],
          [
            "/groups",
            {
              "tripId": "r",
            },
          ],
        ],
      },
    ];
    for (let i = 0; i < 1; i++) {
      const callbackMock = vi.fn(callback);
      const result = await resolveRelations([
        '/groups',
        '/groups/{groupId}/trips',
        '/groups/{groupId}/trips/{tripId}/items',
      ], {
        groupId: {
          collection: 'groups',
          field: 'id',
        },
        tripId: {
          collection: 'trips',
          field: 'id',
        }
      }, {
        groups,
        trips,
      }, callbackMock);
      expect(result).toEqual(rounds[i].results);
      expect(callbackMock.mock.calls).toEqual(rounds[i].calls);
    }
  });

});
