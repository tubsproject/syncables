import 'dotenv/config';
import { getFetcher } from './fetcher.js';
import { fetchTracker, addIssue, addComment } from './tasks.js';
async function test() {
    const fetcher = await getFetcher();
    const before = await fetchTracker(process.env.TRACKER_IN_SOLID, fetcher);
    //   console.log(JSON.stringify(index, null, 2));
    //   console.log(JSON.stringify(state, null, 2));
    console.log(JSON.stringify(before, null, 2));
    const newIssue = {
        title: `Added through Solid Data Modules at ${new Date().toUTCString()}`,
        description: 'What do you want me to say...',
    };
    const issueUri = await addIssue(before, newIssue, fetcher);
    console.log('Issue created', issueUri);
    const newComment = {
        issueUri,
        author: 'https://michielbdejong.solidcommunity.net/profile/card#me',
        text: `That's a good question at ${new Date().toUTCString()}`,
    };
    const commentUri = await addComment(before, newComment, fetcher);
    console.log('Comment created', commentUri);
    const after = await fetchTracker(process.env.TRACKER_IN_SOLID, fetcher);
    console.log(JSON.stringify(after, null, 2));
}
//...
test();
//# sourceMappingURL=testTracker.js.map