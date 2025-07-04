import { loadYamlLens, reverseLens, applyLensToDoc } from 'cambria';
const lensYaml = `
lens:
- remove: { name: model, type: string }
- remove: { name: date, type: date }
- rename:
    source: authorId
    destination: user
- rename:
    source: channelId
    destination: channel
`;
// - rename:
//     source: localId
//     destination: ts
// - add:
//     name: metadata
//     type: object
// - plunge:
//     name: foreignIds
//     host: metadata
// - in:
//     name: metadata
//     lens:
//       - add:
//           name: event_type
//           type: string
//       - add:
//           name: event_payload
//           type: object
//       - plunge:
//           name: foreignIds
//           host: event_payload
// - mapping:
//     - model: event_type
//         - message: from_tubs
//     - event_type: model
//         - from_tubs: message
// - plunge:
//     name: event_type
//     host: metadata
// - add:
//     name: event_payload
//     type: object
// - plunge:
//     name: event_type
//     host: metadata
// - plunge:
//     name: foreignIds
//     host: metadata
async function run() {
    const lens = loadYamlLens(lensYaml);
    const drop = {
        localId: undefined,
        foreignIds: {
            solid: 'https://michielbdejong.solidcommunity.net/IndividualChats/bridged-from-slack/2025/05/12/chat.ttl#Msg1747070109746',
            tubs: 'd8f1fcca-b1e7-4f62-bcd9-4512346ceb65',
        },
        model: 'message',
        text: 'vc',
        date: new Date('2025-05-12T17:15:09.000Z'),
        authorId: 'U0816RHEE85',
        channelId: 'C08RHPHV05D',
    };
    // Cambria chokes on explicitly undefined fields, so remove it:
    if (typeof drop.localId === 'undefined') {
        delete drop.localId;
    }
    const newDoc = applyLensToDoc(lens, drop);
    console.log(newDoc);
    const fromSlack = {
        ts: '1234.567',
        text: 'Hello',
        user: 'U0816RHEE85',
        channel: 'C08RHPHV05D',
        metadata: {
            event_type: 'from_tubs',
            event_payload: {
                foreignIds: {
                    tubs: '12345',
                    solid: 'https://example.com/#Msg',
                },
            },
        },
    };
    const reversed = applyLensToDoc(reverseLens(lens), fromSlack);
    console.log(reversed);
}
// ...
run();
// output:
// {
//   channel: 'C08RHPHV05D',
//   user: 'U0816RHEE85',
//   foreignIds: {
//     solid: 'https://michielbdejong.solidcommunity.net/IndividualChats/bridged-from-slack/2025/05/12/chat.ttl#Msg1747070109746',
//     tubs: 'd8f1fcca-b1e7-4f62-bcd9-4512346ceb65'
//   },
//   text: 'vc'
// }
// {
//   authorId: 'U0816RHEE85',
//   channelId: 'C08RHPHV05D',
//   ts: '1234.567',
//   text: 'Hello',
//   metadata: { event_type: 'from_tubs', event_payload: { foreignIds: [Object] } },
//   model: ''
// }
//# sourceMappingURL=cambriaTest.js.map