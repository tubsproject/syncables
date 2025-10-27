/* eslint @typescript-eslint/no-explicit-any: 0 */
export async function fetchFromApi(
  openApiSpec: any,
  endPoint: string,
  authHeaders: { [key: string]: string },
  contentType: string,
): Promise<Response> {
  // FIXME: do this URL templating from env vars in a nicer way
  endPoint = endPoint.replace(
    '{orgId}',
    process.env.ARRATECH_ORG_ID || '{orgId}',
  );
  endPoint = endPoint.replace(
    '{teamId}',
    process.env.RECOMMAND_TEAM_ID || '{teamId}',
  );
  let url = openApiSpec.servers[0].url + endPoint; // + '?key=' + process.env.GOOGLE_API_KEY;
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }
  // console.log(`Fetching data from ${url} with headers:`, authHeaders);
  const res = await fetch(url, {
    headers: Object.assign({}, authHeaders, {
      'Content-Type': contentType,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch data from ${url}: ${res.status} ${res.statusText}`,
    );
  }
  return res;
}

export async function fetchData(
  openApiSpec: any,
  endPoint: string,
  authHeaders: { [key: string]: string },
): Promise<object> {
  const res = await fetchFromApi(
    openApiSpec,
    endPoint,
    authHeaders,
    'application/ld+json',
  );
  return await res.json();
}

export async function getXmlDoc(
  openApiSpec: any,
  endPoint: string,
  authHeaders: { [key: string]: string },
): Promise<string> {
  const res = await fetchFromApi(
    openApiSpec,
    endPoint,
    authHeaders,
    'text/xml',
  );
  return await res.text();
}
