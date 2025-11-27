/* eslint @typescript-eslint/no-explicit-any: 0 */
export async function fetchData(
  openApiSpec: any,
  endPoint: string,
  token: string,
): Promise<void> {
  const url = openApiSpec.servers[0].url + endPoint; // + '?key=' + process.env.GOOGLE_API_KEY;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}
