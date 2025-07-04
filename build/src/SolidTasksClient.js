import { getFetcher } from './solid/fetcher.js';
import { fetchTracker } from './solid/tasks.js';
function renameFields(from, renameFields) {
    return Object.keys(from)
        .filter(key => Object.keys(renameFields).includes(key))
        .reduce((obj, key) => {
        obj[renameFields[key]] = from[key];
        return obj;
    }, {});
}
class SolidTrackerLens {
    forward(from) {
        return renameFields(from, {
            authorId: 'author',
            indexUri: 'localId',
            created: 'created',
            initialState: 'initialState',
            assigneeClass: 'assigneeClass',
        });
    }
    backward(from) {
        return renameFields(from, {
            author: 'authorId',
            localId: 'indexUri',
            created: 'created',
            initialState: 'initialState',
            assigneeClass: 'assigneeClass',
        });
    }
}
class SolidIssueLens {
    forward(from) {
        return renameFields(from, {
            uri: 'localId',
            authorId: 'author',
            created: 'created',
            initialState: 'initialState',
            assigneeClass: 'assigneeClass',
        });
    }
    backward(from) {
        return renameFields(from, {
            localId: 'uri',
            author: 'authorId',
            created: 'created',
            description: 'description',
        });
    }
}
class SolidCommentLens {
    forward(from) {
        return renameFields(from, {
            uri: 'localId',
            authorId: 'author',
            created: 'created',
            initialState: 'initialState',
            assigneeClass: 'assigneeClass',
        });
    }
    backward(from) {
        return renameFields(from, {
            localId: 'uri',
            author: 'authorId',
            created: 'created',
            description: 'description',
        });
    }
}
export class SolidClient {
    fetch;
    tub;
    trackerLens;
    issueLens;
    commentLens;
    constructor(tub) {
        this.tub = tub;
        this.trackerLens = new SolidTrackerLens();
        this.issueLens = new SolidIssueLens();
        this.commentLens = new SolidCommentLens();
    }
    store(model, data) {
        console.log(model, data);
    }
    async connect() {
        this.fetch = await getFetcher();
        const data = await fetchTracker(process.env.TRACKER_IN_SOLID, this.fetch);
        this.store('tracker', data.tracker);
        // da
    }
}
//# sourceMappingURL=SolidTasksClient.js.map