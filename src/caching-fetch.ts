import { readFile, writeFile } from 'fs/promises';
import { createHash } from 'crypto';
import { mkdirp } from 'mkdirp';

export const FETCH_CACHE_DIR = '.fetch-cache';

let cacheDirExistenceChecked = false;
const ensureCacheDirExists = async (): Promise<void> => {
  if (cacheDirExistenceChecked) return;
  await mkdirp(FETCH_CACHE_DIR);
  cacheDirExistenceChecked = true;
};

const fetchFunction: typeof fetch = async (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  console.log('Fetch called with args:', input, init);
  await ensureCacheDirExists();
  const data = JSON.stringify([input, init]);
  const hash = createHash('sha256').update(data).digest('hex');
  try {
    const cachedStr = await readFile(`${FETCH_CACHE_DIR}/${hash}.json`);
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
    await writeFile(`${FETCH_CACHE_DIR}/${hash}.json`, JSON.stringify(cached));
    console.log('cached response for', input, hash);
    return new Response(text, {
      status: fetched.status,
      headers: fetched.headers,
    });
  }
};
export { fetchFunction };
