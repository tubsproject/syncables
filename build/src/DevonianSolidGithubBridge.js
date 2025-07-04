import { DevonianTable, DevonianLens, } from 'devonian';
export class DevonianSolidGithubBridge {
    index;
    solidIssueTable;
    githubIssueTable;
    constructor(index, SolidIssueClient, GithubIssueClient, replicaId) {
        this.index = index;
        this.solidIssueTable = new DevonianTable({
            client: SolidIssueClient,
            idFieldName: 'uri',
            platform: 'solid',
            replicaId
        });
        this.githubIssueTable = new DevonianTable({
            client: GithubIssueClient,
            idFieldName: 'number',
            platform: 'github',
            replicaId
        });
        new DevonianLens(this.solidIssueTable, this.githubIssueTable, 
        // Solid Issue fields:
        //   uri: string;
        //   author: string;
        //   title: string;
        //   created: Date;
        //   description: string;
        //   trackerIndexUri: string;
        //   commentUris: string[];
        // Github Issue fields:
        //   foreignIds: IdentifierMap;
        //   number: number | undefined;
        //   title: string;
        //   body: string;
        async (input) => {
            const ret = {
                number: this.index.convertId('issue', 'solid', input.uri, 'github'),
                title: input.title,
                body: input.description,
                foreignIds: input.foreignIds,
            };
            console.log('converting from Solid to Slack', input, ret);
            return ret;
        }, async (input) => {
            const ret = {
                uri: this.index.convertId('issue', 'github', input.number.toString(), 'solid'),
                title: input.title,
                description: input.body,
                foreignIds: input.foreignIds,
            };
            console.log('converting from Slack to Solid', input, ret);
            return ret;
        });
    }
}
//# sourceMappingURL=DevonianSolidGithubBridge.js.map