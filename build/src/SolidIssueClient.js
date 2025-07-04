import { DevonianClient } from 'devonian';
// import { getFetcher } from './solid/fetcher.js';
import { fetchTracker, addIssue } from 'solid-data-module-tasks';
export class SolidIssueClient extends DevonianClient {
    solidClient;
    localState;
    constructor(solidClient) {
        super();
        this.solidClient = solidClient;
    }
    async fetchTracker() {
        this.localState = await fetchTracker(process.env.TRACKER_IN_SOLID, this.solidClient.fetch);
        console.log(this.localState);
        Object.keys(this.localState.issues).forEach((issueUri) => {
            this.emit('add-from-client', {
                uri: issueUri,
                title: this.localState.issues[issueUri].title,
                description: this.localState.issues[issueUri].description,
                foreignIds: this.solidClient.getIdentifierMap(issueUri, 'issue'),
            });
        });
    }
    async connect() {
        await this.solidClient.ensureConnected();
        await this.fetchTracker();
        this.solidClient.subscribe(process.env.TRACKER_IN_SOLID, (notificationText) => {
            console.log('Tracker index changed', notificationText);
            this.fetchTracker();
        });
        this.solidClient.subscribe(this.localState.tracker.stateUri, (notificationText) => {
            console.log('Tracker state doc changed', notificationText);
            this.fetchTracker();
        });
    }
    async add(obj) {
        const uri = await addIssue(this.localState, obj, this.solidClient.fetch);
        return Object.assign(obj, { uri });
    }
}
// async function test(): Promise<void> {
//   const fetcher = await getFetcher();
//   const before = await fetchTracker(process.env.TRACKER_IN_SOLID, fetcher);
//   //   console.log(JSON.stringify(index, null, 2));
//   //   console.log(JSON.stringify(state, null, 2));
//   console.log(JSON.stringify(before, null, 2));
//   const newIssue = {
//     title: `Added through Solid Data Modules at ${new Date().toUTCString()}`,
//     description: 'What do you want me to say...',
//   };
//   const issueUri = await addIssue(before, newIssue, fetcher);
//   console.log('Issue created', issueUri);
//   const newComment = {
//     issueUri,
//     author: 'https://michielbdejong.solidcommunity.net/profile/card#me',
//     text: `That's a good question at ${new Date().toUTCString()}`,
//   };
//   const commentUri = await addComment(before, newComment, fetcher);
//   console.log('Comment created', commentUri);
//   const after = await fetchTracker(process.env.TRACKER_IN_SOLID, fetcher);
//   console.log(JSON.stringify(after, null, 2));
// }
//...
// test();
//# sourceMappingURL=SolidIssueClient.js.map