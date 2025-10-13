/* eslint @typescript-eslint/no-explicit-any: 0 */
export async function fetchData(
  openApiSpec: any,
  endPoint: string,
  authHeaders: { [key: string]: string },
): Promise<object> {
  console.log(`Fetching data from ${openApiSpec.servers[0].url + endPoint} with headers:`, authHeaders);
  const url = openApiSpec.servers[0].url + endPoint; // + '?key=' + process.env.GOOGLE_API_KEY;
  const res = await fetch(url, {
    headers: Object.assign({}, authHeaders, {
      'Content-Type': 'application/json',
    }),
  });
  // console.log(`Response status: ${res.status}`, await res.text());
  return await res.json();
}
