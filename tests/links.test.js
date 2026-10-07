'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { checkLink, checkLinks, extractLinks } = require('../scripts/lib/links');
const { startLinkServer } = require('./helpers/link-server');

const fast = { retries: 2, retryDelayMs: 0, timeoutMs: 2000 };

async function withServer(fn) {
  const server = await startLinkServer();
  try {
    await fn(server);
  } finally {
    await server.close();
  }
}

test('extractLinks finds http(s) links with line numbers and skips the rest', () => {
  const text = [
    '# Title',
    '',
    '- [A](https://a.example) - Does a.',
    'See [docs](https://b.example/docs) and [more](http://c.example).',
    '[relative](CONTRIBUTING.md) [anchor](#x) [mail](mailto:a@b.example)',
    '```',
    '- [Fenced](https://fenced.example) - not a real entry',
    '```',
    '   ```',
    '   [indented](https://indented.example)',
    '   ```',
  ].join('\n');

  assert.deepEqual(extractLinks(text), [
    { file: 'README.md', line: 3, url: 'https://a.example' },
    { file: 'README.md', line: 4, url: 'https://b.example/docs' },
    { file: 'README.md', line: 4, url: 'http://c.example' },
  ]);
});

test('a working link is ok', () =>
  withServer(async (server) => {
    const url = `${server.url}/ok`;
    assert.deepEqual(await checkLink(url, fast), { url, status: 'ok', code: 200, detail: 'ok' });
  }));

test('a missing page fails as not found', () =>
  withServer(async (server) => {
    const result = await checkLink(`${server.url}/gone`, fast);
    assert.equal(result.status, 'fail');
    assert.equal(result.code, 404);
    assert.match(result.detail, /not found/);
  }));

test('a redirect is a warning that names the new address', () =>
  withServer(async (server) => {
    const result = await checkLink(`${server.url}/moved`, fast);
    assert.equal(result.status, 'warn');
    assert.match(result.detail, /^redirects to .*\/ok$/);
  }));

test('a server that rejects HEAD is retried with GET', () =>
  withServer(async (server) => {
    assert.equal((await checkLink(`${server.url}/head-405`, fast)).status, 'ok');
    assert.equal((await checkLink(`${server.url}/head-404`, fast)).status, 'ok');
  }));

test('a flaky server is retried until it answers', () =>
  withServer(async (server) => {
    const result = await checkLink(`${server.url}/flaky`, fast);
    assert.equal(result.status, 'ok');
    assert.ok(server.hits('/flaky') >= 3);
  }));

test('a server that keeps failing is reported as a server error', () =>
  withServer(async (server) => {
    const result = await checkLink(`${server.url}/always-503`, fast);
    assert.equal(result.status, 'fail');
    assert.match(result.detail, /server error \(503\)/);
  }));

test('rate limiting and access denied are warnings, not failures', () =>
  withServer(async (server) => {
    const rate = await checkLink(`${server.url}/rate`, fast);
    assert.equal(rate.status, 'warn');
    assert.match(rate.detail, /rate limited/);
    assert.ok(server.hits('/rate') >= 3);

    const forbidden = await checkLink(`${server.url}/forbidden`, fast);
    assert.equal(forbidden.status, 'warn');
    assert.match(forbidden.detail, /access denied \(403\)/);
  }));

test('a server that never answers times out', () =>
  withServer(async (server) => {
    const result = await checkLink(`${server.url}/slow`, { ...fast, retries: 0, timeoutMs: 100 });
    assert.equal(result.status, 'fail');
    assert.equal(result.detail, 'timed out');
  }));

test('a host that refuses connections fails', async () => {
  const result = await checkLink('http://127.0.0.1:1/x', { ...fast, retries: 0 });
  assert.equal(result.status, 'fail');
  assert.match(result.detail, /cannot connect/);
});

test('checkLinks keeps the input order', () =>
  withServer(async (server) => {
    const urls = [`${server.url}/ok`, `${server.url}/gone`, `${server.url}/ok2`];
    const results = await checkLinks(urls, { ...fast, concurrency: 2 });
    assert.deepEqual(
      results.map((result) => [result.url, result.status]),
      [
        [urls[0], 'ok'],
        [urls[1], 'fail'],
        [urls[2], 'ok'],
      ]
    );
  }));