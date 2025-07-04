import { Agent } from 'undici';
import { Fetcher, graph, UpdateManager, sym, Namespace, 
// isNamedNode,
st, } from 'rdflib';
// import { executeUpdate } from "@solid-data-modules/rdflib-utils";
import ChatsModuleRdfLib from '@solid-data-modules/chats-rdflib';
// import { fetchTracker } from './solid/tasks.js';
import { getFetcher } from './solid/fetcher.js';
const owl = Namespace('http://www.w3.org/2002/07/owl#');
// setGlobalDispatcher(new Agent({bodyTimeout: 0}));
export class SolidChatClient {
    fetch;
    store;
    fetcher;
    updater;
    module;
    tub;
    constructor(tub) {
        this.tub = tub;
        this.tub.addTable({
            name: 'message',
            columns: [
                { name: 'uri', type: 'string', isIndex: true },
                { name: 'text', type: 'string' },
                { name: 'date', type: 'date' },
                { name: 'authorWebId', type: 'string', isRelation: true, toTable: 'person' },
                { name: 'chatUri', type: 'string', isRelation: true, toTable: 'chat' },
            ],
            canStoreMetadata: true,
        });
        this.tub.addTable({
            name: 'person',
            columns: [
                { name: 'id', type: 'string', isIndex: true },
            ],
            canStoreMetadata: true,
        });
        this.tub.addTable({
            name: 'chat',
            columns: [
                { name: 'id', type: 'string', isIndex: true },
            ],
            canStoreMetadata: true,
        });
        setInterval(() => {
            this.fetchChat();
        }, 5000);
    }
    async connect() {
        console.log(`Connecting to Solid...`);
        this.fetch = await getFetcher();
        this.initSolidDataModule();
    }
    async createChat(containerUri, name) {
        console.log(`Creating Solid chat ${name} in ${containerUri}`);
        console.log(`Calling Solid chat data module`);
        // 3️⃣ use the module to interact with chats
        const uri = await this.module.createChat({
            containerUri,
            name,
        });
        console.log(`Created Solid chat ${uri}`);
        return uri;
    }
    // async readChat(chatUri: string): Promise<object> {
    //   return this.module.readChat(chatUri);
    // }
    getTodayDoc(chatUri) {
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
    async createOnPlatform(solidChatMessage) {
        console.log('creating on Solid:', solidChatMessage);
        // if (solidChatMessage.model === 'message') {
        // const solidChatMessage = this.dropToSolidChatMessage(drop);
        // console.log(solidChatMessage);
        const localId = await this.module.postMessage(solidChatMessage.sdmPost);
        const promises = solidChatMessage.sameAs.map(async (platformUri) => {
            const messageNode = sym(localId);
            await this.updater.updateMany([], [
                st(messageNode, owl('sameAs'), sym(platformUri), messageNode.doc()),
            ]);
        });
        await Promise.all(promises);
        console.log('Created on Solid as:', localId);
        this.tub.addObject('message', Object.assign(solidChatMessage, { localId })); // writing back the localId that was minted
        // }
        // console.log(`added message to Solid chat`, messageUri);
    }
    async foreignIdAdded(model, localId, foreignPlatform, foreignId) {
        if (localId === 'https://michielbdejong.solidcommunity.net/profile/card#me') {
            return; // this leads to a 500 error, it seems
        }
        const messageNode = sym(localId);
        await this.updater.updateMany([], [
            st(messageNode, owl('sameAs'), sym(`https://tubsproject.org/id/${foreignPlatform}/${model}/${foreignId}`), messageNode.doc()),
        ]);
    }
    entryToDrops(entry) {
        const channelDrop = {
            localId: process.env.CHANNEL_IN_SOLID,
            foreignIds: {},
            model: 'channel',
        };
        const authorDrop = {
            localId: entry.authorWebId,
            foreignIds: {},
            model: 'author',
        };
        const messageDrop = {
            sdmPost: Object.assign(entry, {
                chatUri: process.env.CHANNEL_IN_SOLID,
            }),
            sameAs: this.store.each(sym(entry.uri), owl('sameAs'), null, sym(entry.uri).doc()).map((node) => node.value),
        };
        // console.log('entryToDrops', entry, channelDrop, authorDrop, messageDrop);
        return [channelDrop, authorDrop, messageDrop];
    }
    initSolidDataModule() {
        this.store = graph();
        this.updater = new UpdateManager(this.store);
        this.fetcher = new Fetcher(this.store, {
            fetch: this.fetch,
        });
        this.module = new ChatsModuleRdfLib({
            store: this.store,
            fetcher: this.fetcher,
            updater: this.updater,
        });
    }
    async fetchChat() {
        this.initSolidDataModule();
        // if (this.fetcher) {
        //   console.log('fetching todayDoc');
        //   await this.fetcher.load(this.getTodayDoc(process.env.CHANNEL_IN_SOLID));
        //   console.log('done fetching todayDoc');
        // } else {
        //   console.error('no fetcher?');
        // }
        const { latestMessages, } = await this.module.readChat(process.env.CHANNEL_IN_SOLID);
        // console.log(latestMessages);
        await Promise.all(latestMessages.map(async (entry) => {
            const [channelDrop, authorDrop, solidChatMessage] = this.entryToDrops(entry);
            if (typeof solidChatMessage.sdmPost.chatUri !== 'string') {
                console.error('weird, no channel found for this entry of latestMessages from the chat SDM?', entry);
            }
            console.log('Solid incoming:', solidChatMessage.sdmPost.text);
            this.tub.addObject('channel', channelDrop);
            this.tub.addObject('author', authorDrop);
            this.tub.addObject('message', solidChatMessage);
        }));
    }
    // async fetchTracker(): Promise<void> {
    //   return fetchTracker(process.env.TRACKER_IN_SOLID, this.fetch);
    // }
    async listen() {
        this.tub.on('create', this.createOnPlatform.bind(this));
        this.tub.on('foreign-id-added', this.foreignIdAdded.bind(this));
        const topic = process.env.CHANNEL_IN_SOLID;
        this.tub.addObject('channel', { localId: topic, foreignIds: {}, model: 'channel' });
        const todayDoc = this.getTodayDoc(topic);
        // FIXME: discover this URL from the response header link:
        const streamingUrl = `https://solidcommunity.net/.notifications/StreamingHTTPChannel2023/${encodeURIComponent(todayDoc)}`;
        // console.log('Fetching Solid streaming URL');
        const res = await this.fetch(streamingUrl, {
            dispatcher: new Agent({ bodyTimeout: 0 }),
        });
        // console.log('Setting up stream listener');
        const textStream = res.body.pipeThrough(new TextDecoderStream());
        // let doneOne = false;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _notificationText of textStream) {
            // console.log(notificationText);
            // console.log('fetching chat!');
            this.fetchChat();
        }
        // console.log('Outside stream listener\'s for-await loop');
    }
}
//# sourceMappingURL=SolidChatClient.js.map