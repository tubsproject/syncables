import { listItems, getAuthHeaderSet } from './common.js';

// ...
if (process.argv.length < 3) {
    throw new Error('Usage: node build/src/eperiment/heroku/list.js field id');
}
const field = process.argv[2];
if (['id', 'hostname'].indexOf(field) === -1) {
    throw new Error('field should be id or hostname');
}
const firstId = process.argv[3];
// console.log('fetching with', firstId);
const items = await listItems(await getAuthHeaderSet(), field, firstId);
console.log(items);