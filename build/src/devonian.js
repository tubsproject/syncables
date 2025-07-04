// function createModel() {
export {};
// }
// class Model {
//   id: string;
//   facets: {
//     [platform: string]: {
//       get: () => object,
//       set: (input: object) => void
//     }
//   }
//   defineFacet(platform: string; get: () => object, set: (input: object) => void) {
//   }
// }
// class Person extends Model {
// }
// class Message extends Model {
//   text: string;
//   created: Date;
//   author: Person;
//   constructor(text: string, created: Date, author: Person) {
//     super();
//     this.text = text;
//     this.created = created;
//     this.author = author;
//     this.defineFacet('slack', () => {
//       return {
//         ts: this.id,
//         text: this.text,
//         user: this.author,
//       }
//     })
//   }
// }
// const Message = createModel({
//   name: 'Message',
//   properties: {
//     text: 'string',
//     created: 'Date'
//   },
//   relations: {
//     author: 'Person'
//   },
//   facets: {
//     slack: [
//       (base: object
// });
//# sourceMappingURL=devonian.js.map