import { randomBytes } from 'node:crypto';
import { EventEmitter } from 'node:events';
const bolt = await import('@slack/bolt');
const App = bolt.default.App;

const BOLT_PORT = 7000;
export interface IMessage {
  client_msg_id: string;
  type: string;
  text: string;
  user: string;
  ts: string;
  blocks: Block[];
  team: string;
  channel: string;
  event_ts: string;
  channel_type: string;
}

export interface Block {
  type: string;
  block_id: string;
  elements: object[];
}

export interface IUserInfo {
  ok: boolean;
  user: User;
}

export interface User {
  id: string;
  team_id: string;
  name: string;
  deleted: boolean;
  color: string;
  real_name: string;
  tz: string;
  tz_label: string;
  tz_offset: number;
  profile: { [key: string]: string };
  is_admin: boolean;
  is_owner: boolean;
  is_primary_owner: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_bot: boolean;
  updated: number;
  is_app_user: boolean;
  has_2fa: boolean;
}

export class SlackClient extends EventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private app: any;
  private logins: { [nonce: string]: string } = {};
  private logouts: { [nonce: string]: string } = {};
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

  async create(EXPRESS_FULL_URL: string): Promise<void> {
    this.app.command('/tubs-connect', async ({ command, ack }) => {;
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
  async start(port: number): Promise<void> {
    await this.app.start(port);
  }
}
