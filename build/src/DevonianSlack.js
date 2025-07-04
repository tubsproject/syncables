import { DevonianClient } from 'devonian';
const bolt = await import('@slack/bolt');
const App = bolt.default.App;
const BOLT_PORT = 7000;
export function slackMetadataToForeignIds(metadata) {
    if (metadata?.event_payload?.foreignIds) {
        return metadata.event_payload.foreignIds;
    }
    return {};
}
export class SlackMessageClient extends DevonianClient {
    index;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app;
    constructor(index) {
        super();
        this.index = index;
        this.on('add', (obj) => {
            console.log('incoming slack message');
            this.storeIdentitiesFromSlack(obj);
        });
        this.app = new App({
            signingSecret: process.env.SLACK_SIGNING_SECRET,
            token: process.env.SLACK_BOT_USER_TOKEN,
            appToken: process.env.SLACK_APP_TOKEN,
            socketMode: true,
            port: BOLT_PORT,
        });
    }
    async connect() {
        this.app.message(async ({ message }) => {
            console.log('emitting add-from-client', message);
            this.emit('add-from-client', message);
        });
        await this.app.start(9999);
    }
    storeIdentitiesFromSlack(input) {
        this.index.storeIdentitiesFrom('message', 'slack', input.ts, input.metadata.event_payload);
        // }
    }
    async add(obj) {
        this.storeIdentitiesFromSlack(obj);
        const created = await this.app.client.chat.postMessage({
            text: obj.text,
            channel: obj.channel,
            metadata: obj.metadata,
        });
        if (!created.ok) {
            throw new Error('Could not post message to Slack');
        }
        return created.ts;
    }
}
//# sourceMappingURL=DevonianSlack.js.map