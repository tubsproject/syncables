import { randomBytes } from 'node:crypto';
import { EventEmitter } from 'node:events';
const bolt = await import('@slack/bolt');
const App = bolt.default.App;
const BOLT_PORT = 7000;
export class SlackClient extends EventEmitter {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app;
    logins = {};
    logouts = {};
    constructor() {
        super();
        this.app = new App({
            signingSecret: process.env.SLACK_SIGNING_SECRET,
            token: process.env.SLACK_BOT_USER_TOKEN,
            appToken: process.env.SLACK_APP_TOKEN,
            socketMode: true,
            port: BOLT_PORT,
        });
    }
    async create(EXPRESS_FULL_URL) {
        this.app.command('/tubs-connect', async ({ command, ack }) => {
            ;
            const uuid = command.user_id;
            const nonce = randomBytes(16).toString('hex');
            this.logins[nonce] = uuid;
            const loginURL = `${EXPRESS_FULL_URL}/slack/login?nonce=${nonce}`;
            await ack(loginURL);
        });
        this.app.command('/tubs-disconnect', async ({ command, ack }) => {
            const uuid = command.user_id;
            const nonce = randomBytes(16).toString('hex');
            this.logouts[nonce] = uuid;
            const logoutURL = `${EXPRESS_FULL_URL}/slack/logout?nonce=${nonce}`;
            await ack(logoutURL);
        });
        this.app.message(async ({ message }) => {
            this.emit('message', message);
        });
    }
    async start(port) {
        await this.app.start(port);
    }
}
//# sourceMappingURL=SlackClient.js.map