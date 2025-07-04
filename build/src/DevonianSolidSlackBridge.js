import { DevonianTable, DevonianLens } from 'devonian';
export class DevonianSolidSlackBridge {
    index;
    solidMessageTable;
    slackMessageTable;
    constructor(index, solidMessageClient, slackMessageClient) {
        this.index = index;
        this.solidMessageTable = new DevonianTable({ client: solidMessageClient, idFieldName: 'uri', platform: 'solid', replicaId: 'test-replica' });
        this.slackMessageTable = new DevonianTable({ client: slackMessageClient, idFieldName: 'ts', platform: 'slack', replicaId: 'test-replica' });
        new DevonianLens(this.solidMessageTable, this.slackMessageTable, async (input) => {
            const ret = {
                ts: this.index.convertId('message', 'solid', input.uri, 'slack'),
                user: this.index.convertId('person', 'solid', input.authorWebId, 'slack'),
                text: input.text,
                channel: this.index.convertId('channel', 'solid', input.chatUri, 'slack'),
                foreignIds: this.index.convertForeignIds('solid', input.uri, input.foreignIds, 'slack'),
            };
            // console.log('converting from Solid to Slack', input, ret);
            return ret;
        }, async (input) => {
            const ret = {
                uri: this.index.convertId('message', 'slack', input.ts, 'solid'),
                chatUri: this.index.convertId('channel', 'slack', input.channel, 'solid'),
                text: input.text,
                authorWebId: this.index.convertId('person', 'slack', input.user, 'solid'),
                date: new Date(parseFloat(input.ts) * 1000),
                foreignIds: this.index.convertForeignIds('slack', input.ts, input.foreignIds, 'solid'),
            };
            // console.log('converting from Slack to Solid', input, ret);
            return ret;
        });
    }
}
//# sourceMappingURL=DevonianSolidSlackBridge.js.map