/* eslint-disable  @typescript-eslint/no-explicit-any */
import { randomUUID } from 'node:crypto';
import { Repo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
// import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { NodeFSStorageAdapter } from '@automerge/automerge-repo-storage-nodefs';
export class Tub {
    repo;
    docHandle;
    doc;
    name;
    constructor(name) {
        this.repo = new Repo({
            // network: [new BrowserWebSocketClientAdapter('wss://sync.automerge.org')],
            network: [new BroadcastChannelNetworkAdapter()],
            storage: new NodeFSStorageAdapter('./data'),
        });
        this.name = name;
    }
    handleChange({ doc }) {
        console.log(`new doc contents in repo ${this.name} is`, JSON.stringify(doc, null, 2));
    }
    async createDoc() {
        this.docHandle = this.repo.create();
        this.doc = await this.docHandle.doc();
        this.docHandle.on('change', this.handleChange.bind(this));
        console.log(`doc created in repo ${this.name}`, this.docHandle.documentId);
        return this.docHandle.documentId;
    }
    async setDoc(docUrl) {
        console.log(`finding doc in repo ${this.name}`, docUrl);
        this.docHandle = this.repo.find(docUrl);
        this.doc = await this.docHandle.doc();
        this.docHandle.on('change', this.handleChange.bind(this));
        do {
            console.log(`waiting for doc ${this.name} to be ready`);
            await new Promise((x) => setTimeout(x, 1000));
        } while (!this.docHandle.isReady());
    }
    async setDictValue(dict, key, value) {
        this.docHandle.change((d) => {
            if (typeof d[dict] === 'undefined') {
                d[dict] = {};
            }
            d[dict][key] = value;
        });
        this.doc = await this.docHandle.doc();
        return value;
    }
    async getDictValue(dict, key) {
        if (typeof this.doc[dict] === 'undefined' ||
            typeof this.doc[dict][key] === 'undefined') {
            return this.setDictValue(dict, key, randomUUID());
        }
        return this.doc[dict][key];
    }
    async getId(localId) {
        return this.getDictValue('index', localId);
    }
    async setData(uuid, value) {
        return this.setDictValue('objects', uuid, value);
    }
}
//# sourceMappingURL=tub.js.map