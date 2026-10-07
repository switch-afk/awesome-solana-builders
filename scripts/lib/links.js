'use strict';

const USER_AGENT =
  'awesome-solana-builders-link-checker (+https://github.com/switch-afk/awesome-solana-builders)';
const LINK = /\]\((https?:\/\/[^)\s]+)\)/g;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Every http(s) link in a markdown file, with its line number.
 * Links inside fenced code blocks are examples, so they are skipped.
 */
function extractLinks(text, file = 'README.md') {
  const links = [];
  let inFence = false;

  text.split(/\r?\n/).forEach((line, index) => {
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    for (const match of line.matchAll(LINK)) {
      links.push({ file, line: index + 1, url: match[1] });
    }
  });

  return links;
}

/**
 * fetch() wraps the real network error (ECONNREFUSED, ENOTFOUND, ...) in a
 * generic "fetch failed", sometimes inside an AggregateError. Look through
 * the whole chain for the code.
 */
function findErrorCode(error, depth = 0) {
  if (!error || depth > 4) return null;
  if (typeof error.code === 'string') return error.code;

  const children = [error.cause, ...(Array.isArray(error.errors) ? error.errors : [])];
  for (const child of children) {
    const code = findErrorCode(child, depth + 1);
    if (code) return code;
  }
  return null;
}

function describeError(error) {
  if (error && error.name === 'TimeoutError') return 'timed out';

  const code = findErrorCode(error);
  if (code) return `cannot connect (${code})`;

  if (error && error.name === 'TypeError' && error.message === 'fetch failed') {
    return 'cannot connect';
  }
  return `request failed (${error && error.message ? error.message : error})`;
}

/** True when two URLs point at the same place, ignoring a trailing slash and #fragment. */
function sameDestination(a, b) {
  const strip = (url) => {
    const parsed = new URL(url);
    parsed.hash = '';
    return parsed.href.replace(/\/+$/, '');
  };
  try {
    return strip(a) === strip(b);
  } catch {
    return false;
  }
}

function send(fetchImpl, url, method, timeoutMs) {
  return fetchImpl(url, {
    method,
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
    headers: { 'user-agent': USER_AGENT, accept: '*/*' },
  });
}

async function discard(response) {
  try {
    await response.body?.cancel();
  } catch {
    // The body is not needed; ignore anything that goes wrong closing it.
  }
}

/**
 * One try at a link. HEAD is cheaper, but plenty of sites answer it wrongly,
 * so any HEAD failure falls back to GET before we believe it.
 */
async function attemptOnce(url, { fetchImpl, timeoutMs }) {
  try {
    let response = await send(fetchImpl, url, 'HEAD', timeoutMs);
    if (response.status >= 400) {
      await discard(response);
      response = await send(fetchImpl, url, 'GET', timeoutMs);
    }
    await discard(response);
    return { response };
  } catch (error) {
    if (error && error.name === 'TimeoutError') return { error };
    try {
      const response = await send(fetchImpl, url, 'GET', timeoutMs);
      await discard(response);
      return { response };
    } catch (second) {
      return { error: second };
    }
  }
}

/** Turn an outcome into a result, and say whether it is worth retrying. */
function classify(url, outcome) {
  if (outcome.error) {
    return { retry: true, result: { status: 'fail', code: null, detail: describeError(outcome.error) } };
  }

  const { response } = outcome;
  const code = response.status;

  if (code >= 200 && code < 300) {
    if (response.redirected && !sameDestination(url, response.url)) {
      return {
        retry: false,
        result: { status: 'warn', code, detail: `redirects to ${response.url}` },
      };
    }
    return { retry: false, result: { status: 'ok', code, detail: 'ok' } };
  }

  if (code === 429) {
    return {
      retry: true,
      result: { status: 'warn', code, detail: 'rate limited, could not verify' },
    };
  }
  if (code === 401 || code === 403) {
    return {
      retry: false,
      result: { status: 'warn', code, detail: `access denied (${code}), could not verify` },
    };
  }
  if (code >= 500) {
    return { retry: true, result: { status: 'fail', code, detail: `server error (${code})` } };
  }
  if (code === 404 || code === 410) {
    return { retry: false, result: { status: 'fail', code, detail: `not found (${code})` } };
  }
  return { retry: false, result: { status: 'fail', code, detail: `unexpected status ${code}` } };
}

/**
 * Check one link. Resolves to { url, status: 'ok' | 'warn' | 'fail', code, detail }.
 * Server errors, rate limits, timeouts and connection errors are retried.
 */
async function checkLink(url, options = {}) {
  const { fetchImpl = fetch, timeoutMs = 15000, retries = 2, retryDelayMs = 1000 } = options;

  let classified;
  for (let attempt = 0; attempt <= retries; attempt++) {
    classified = classify(url, await attemptOnce(url, { fetchImpl, timeoutMs }));
    if (!classified.retry) break;
    if (attempt < retries) await sleep(retryDelayMs * (attempt + 1));
  }

  return { url, ...classified.result };
}

/** Check many links with limited concurrency. Results come back in input order. */
async function checkLinks(urls, options = {}) {
  const { concurrency = 5 } = options;
  const results = new Array(urls.length);
  let next = 0;

  async function worker() {
    while (next < urls.length) {
      const index = next++;
      results[index] = await checkLink(urls[index], options);
    }
  }

  const workers = Math.min(concurrency, urls.length);
  await Promise.all(Array.from({ length: workers }, worker));
  return results;
}

module.exports = { checkLink, checkLinks, extractLinks, findErrorCode };