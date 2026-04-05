import { listTeams, getAuthHeaderSet } from './common.js';

// ...
const firstId = process.argv[2];
// console.log('fetching with', firstId);
const teams = await listTeams(await getAuthHeaderSet(), firstId);
console.log(teams);