import { listEvents, getAuthHeaderSet } from './common.js';

// ...
const pageToken = process.argv[2];
// console.log('fetching with', pageToken);
listEvents(await getAuthHeaderSet(), pageToken ? { pageToken } : {});
