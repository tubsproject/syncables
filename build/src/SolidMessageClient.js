import { DevonianClient } from 'devonian';
import { sym } from 'rdflib';
function getTodayDoc(chatUri) {
    // FIXME: expose this code from https://github.com/solid-contrib/data-modules/blob/main/chats/rdflib/src/module/uris/mintMessageUri.ts
    if (!chatUri.endsWith('index.ttl#this')) {
        throw new Error(`Chat URI ${chatUri} does not end with the expected index.ttl#this, is it really the URI of a LongChat?`);
    }
    // note that this relies on server clocks being in sync
    const date = new Date();
    const dateFolders = date.toISOString().split('T')[0].replace(/-/g, '/');
    const containerUri = chatUri.substring(0, chatUri.length - `index.ttl#this`.length);
    return containerUri + dateFolders + '/chat.ttl';
}
export class SolidMessageClient extends DevonianClient {
    solidClient;
    constructor(solidClient) {
        super();
        this.solidClient = solidClient;
    }
    async connect() {
        await this.solidClient.ensureConnected();
        const todayDoc = getTodayDoc(process.env.CHANNEL_IN_SOLID);
        console.log('fetching todayDoc', todayDoc);
        this.solidClient.subscribe(todayDoc, async () => {
            await this.solidClient.fetcher.load(sym(todayDoc), { force: true });
            const chat = await this.solidClient.chatsModule.readChat(process.env.CHANNEL_IN_SOLID);
            void chat;
            chat.latestMessages.map((entry) => {
                this.emit('add-from-client', Object.assign(entry, {
                    chatUri: process.env.CHANNEL_IN_SOLID,
                    foreignIds: this.solidClient.getIdentifierMap(entry.uri, 'message'),
                }));
            });
        });
    }
    async add(obj) {
        const uri = await this.solidClient.chatsModule.postMessage(obj);
        console.log('posted to Solid', obj, uri);
        this.solidClient.storeIdentifierMap(uri, obj.foreignIds);
        return Object.assign(obj, { uri });
    }
}
//# sourceMappingURL=SolidMessageClient.js.map