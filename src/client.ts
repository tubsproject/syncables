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
      'X-Referer': 'https://explorer.apis.google.com',
      'X-Api-Key': openApiSpec.components?.securitySchemes?.[0]?.apiKey || process.env.PEPPYRUS_TOKEN_TEST!, // FIXME: make this configurable in spec
    },
  });
  return await res.json();
}
