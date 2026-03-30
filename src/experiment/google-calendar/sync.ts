import { listEvents, getAuthHeaderSet } from './common.js';

// ...
const syncToken = process.argv[2];
// console.log('syncing with', syncToken);
// const objects = 
if (!syncToken) {
  console.error('please specify a sync token');
  process.exit(1);
}
await listEvents(await getAuthHeaderSet(), syncToken ? { syncToken } : {});
// console.log(objects);