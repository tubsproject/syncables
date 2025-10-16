import { getSpec } from './openApi.js';
import { createSqlTable, getFields, Client } from './db.js';
import { insertData } from './devonian.js';
import { fetchData } from './client.js';
// import { runOAuthClient } from './oauth.js';

export class Syncable {
  collectionName: string
  specFilename: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  specObject: { syncables: { [key: string]: any } } | undefined
  authHeaders: { [key: string]: string }
  client: Client
  constructor(collectionName: string, specFilename: string, authHeaders: { [key: string]: string }, client: Client) {
    this.collectionName = collectionName;
    this.specFilename = specFilename;
    this.authHeaders = authHeaders;
    this.client = client;
  }
  async init(): Promise<void> {
    this.specObject = await getSpec(this.specFilename);
  }
  async run(): Promise<void> {
    await Promise.all(Object.keys(this.specObject.syncables).map(async (syncableName) => {
      const tableName = `${this.collectionName}_${syncableName}`;
      console.log(
        `Creating syncable ${this.specObject.syncables[syncableName].type}: ${syncableName} as ${tableName}`,
      );
      const endPoint = this.specObject.syncables[syncableName].get?.path || this.specObject.syncables[syncableName].hydra;
      if (this.specObject.syncables[syncableName].get !== undefined) {
        const fields = getFields(this.specObject, endPoint, this.specObject.syncables[syncableName].get.field);
        await createSqlTable(
          this.client,
          tableName,
          fields,
        );
        const data = await fetchData(
          this.specObject,
          endPoint,
          this.authHeaders,
        );
        await insertData(
          this.client,
          tableName,
          data[this.specObject.syncables[syncableName].get.field],
          Object.keys(fields).filter(x => ['string', 'integer', /*'boolean'*/ ].includes(fields[x].type)));
      } else if (this.specObject.syncables[syncableName].hydra !== undefined) {
        const fields = getFields(this.specObject, endPoint, 'hydra:member');
        fields['@context'] = { type: 'string' };
        await createSqlTable(
          this.client,
          tableName,
          fields,
        );
        const data = await fetchData(
          this.specObject,
          endPoint,
          this.authHeaders,
        );
        await insertData(this.client, tableName, data['hydra:member'], Object.keys(fields).filter(x => ['string', 'integer', /*'boolean'*/].includes(fields[x].type)));
      }
    }));
  }
}
