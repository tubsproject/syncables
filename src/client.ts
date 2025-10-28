function determineUrlFromSpec(openApiSpec: { servers: { url: string }[] }, endPoint: string): string {
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
  return url;
}

export async function fetchFromApi(
  openApiSpec: { servers: { url: string }[] },
  endPoint: string,
  authHeaders: { [key: string]: string },
  contentType: string,
): Promise<Response> {
  const url = determineUrlFromSpec(openApiSpec, endPoint);
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

export async function postToApi(
  openApiSpec: { servers: { url: string }[] },
  endPoint: string,
  authHeaders: { [key: string]: string },
  contentType: string,
  body: string,
): Promise<Response> {
  const url = determineUrlFromSpec(openApiSpec, endPoint);
  const headers =  Object.assign({}, authHeaders, {
    'Content-Type': contentType,
  })
  console.log(`Posting to ${url} with headers:`, headers, 'and body:', body);
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch data from ${url}: ${res.status} ${res.statusText} ${await res.text()}`,
    );
  }
  return res;
}

export async function fetchData(
  openApiSpec: { servers: { url: string }[] },
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
  openApiSpec: { servers: { url: string }[] },
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

export async function sendXmlDoc(
  openApiSpec: { servers: { url: string }[] },
  endPoint: string,
  authHeaders: { [key: string]: string },
  xmlDoc: string,
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bodyTypes = (openApiSpec as any).paths[endPoint]?.post?.requestBody?.content;
  if (typeof bodyTypes === 'undefined' || bodyTypes === null) {
    throw new Error(`No request body defined for POST ${endPoint}`);
  }
  const contentTypes = Object.keys(bodyTypes);
  if (contentTypes.length === 0) {
    throw new Error(`No content types defined for POST ${endPoint}`);
  }
  console.log(contentTypes);
  const res = await postToApi(
    openApiSpec,
    endPoint,
    authHeaders,
    contentTypes[0],
    xmlDoc,
  );
  return await res.text();
}