import { EventEmitter } from 'node:events';
export class DevonianMockClient extends EventEmitter {
    added = [];
    name;
    idFieldName;
    constructor(name, idFieldName = 'id') {
        super();
        this.idFieldName = idFieldName;
        this.name = name;
    }
    async add(obj) {
        const position = this.added.length;
        // console.log(`Adding in ${this.name} mock client`, obj, position);
        this.added.push(obj);
        const ret = JSON.parse(JSON.stringify(obj));
        ret[this.idFieldName] = position;
        return ret;
    }
    fakeIncoming(obj) {
        // console.log('fake incoming in mock client', obj);
        this.emit('add-from-client', obj);
    }
}
//# sourceMappingURL=DevonianMockClient.js.map