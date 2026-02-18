import { readFile, writeFile } from 'fs/promises';
import { createHash } from 'crypto';

const fetchFunction: typeof fetch = async (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  console.log('Fetch called with args:', input, init);
  const data = JSON.stringify([input, init]);
  const hash = createHash('sha256').update(data).digest('hex');
  try {
    const cachedStr = await readFile(`./.fetch-cache/${hash}.json`);
    const cached = JSON.parse(cachedStr.toString());
    console.log('using cached response for', input, hash);
    return new Response(cached.body, {
      status: cached.status,
      headers: cached.headers,
    });
  } catch (err) {
    void err;
    const fetched = await fetch(input, init);
    const text = await fetched.text();
    const cached = {
      body: text,
      status: fetched.status,
      headers: Object.fromEntries(
        (
          fetched.headers as unknown as {
            entries: () => Iterable<[string, string]>;
          }
        ).entries(),
      ),
    };
    await writeFile(`./.fetch-cache/${hash}.json`, JSON.stringify(cached));
    console.log('cached response for', input, hash);
    return new Response(text, {
      status: fetched.status,
      headers: fetched.headers,
    });
  }
};
export { fetchFunction };
