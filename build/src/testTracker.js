import { getFetcher } from './solid/fetcher.js';
import { fetchTracker } from './solid/tasks.js';
async function test() {
    const fetcher = await getFetcher();
    fetchTracker(process.env.TRACKER_IN_SOLID, fetcher);
}
//...
test();
//# sourceMappingURL=testTracker.js.map