export class Syncable {
  fetchFunction: typeof fetch;
  
  constructor(fetchFunction: typeof fetch = fetch) {
    this.fetchFunction = fetchFunction;
  }
  run = async () => {
    const response = await this.fetchFunction('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    return data;
  };
}