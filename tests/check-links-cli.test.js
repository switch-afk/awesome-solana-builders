'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');

const { startLinkServer } = require('./helpers/link-server');

const script = path.join(__dirname, '..', 'scripts', 'check-links.js');

// Async on purpose: the test server lives in this process and must keep answering.
function runCheck(args) {
  return new Promise((resolve) => {
    execFile(
      process.execPath,
      [script, ...args],
      {
        env: {
          ...process.env,
          GITHUB_ACTIONS: '',
          LINK_CHECK_RETRY_DELAY_MS: '0',
          LINK_CHECK_TIMEOUT_MS: '2000',
        },
      },
      (error, stdout, stderr) => resolve({ code: error ? error.code : 0, stdout, stderr })
    );
  });
}

function writeMarkdown(body) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'links-'));
  const file = path.join(dir, 'list.md');
  fs.writeFileSync(file, body);
  return file;
}

async function withServer(fn) {
  const server = await startLinkServer();
  try {
    await fn(server);
  } finally {
    await server.close();
  }
}

test('a dead link fails the run and names the file and line', () =>
  withServer(async (server) => {
    const file = writeMarkdown(`- [Fine](${server.url}/ok) - Works.\n- [Gone](${server.url}/gone) - Dead.\n`);
    const { code, stdout } = await runCheck([file]);
    assert.equal(code, 1);
    assert.match(stdout, /list\.md:2 {2}FAIL {2}.*\/gone - not found \(404\)/);
    assert.match(stdout, /Checked 2 links: 1 ok, 0 warnings, 1 failed\./);
  }));

test('warnings do not fail the run', () =>
  withServer(async (server) => {
    const file = writeMarkdown(`- [Moved](${server.url}/moved) - Redirects.\n- [Blocked](${server.url}/forbidden) - Denies bots.\n`);
    const { code, stdout } = await runCheck([file]);
    assert.equal(code, 0);
    assert.match(stdout, /warn {2}.*\/moved - redirects to/);
    assert.match(stdout, /Checked 2 links: 0 ok, 2 warnings, 0 failed\./);
  }));

test('the same link used twice is checked once but reported on both lines', () =>
  withServer(async (server) => {
    const file = writeMarkdown(`[a](${server.url}/gone)\n[b](${server.url}/gone)\n`);
    const { code, stdout } = await runCheck([file]);
    assert.equal(code, 1);
    assert.match(stdout, /list\.md:1 /);
    assert.match(stdout, /list\.md:2 /);
    assert.match(stdout, /Checked 1 link: 0 ok, 0 warnings, 1 failed\./);
  }));

test('a file with no links is fine', async () => {
  const { code, stdout } = await runCheck([writeMarkdown('Just text, and [a relative link](LICENSE).\n')]);
  assert.equal(code, 0);
  assert.match(stdout, /No links to check\./);
});

test('an unreadable file exits 2', async () => {
  const { code, stderr } = await runCheck(['/no/such/file.md']);
  assert.equal(code, 2);
  assert.match(stderr, /Could not read/);
});

test('the repo\'s own files can be read and parsed (no network needed when they have no external links)', async () => {
  const { code, stdout } = await runCheck([path.join(__dirname, '..', 'CONTRIBUTING.md')]);
  assert.equal(code, 0);
  assert.match(stdout, /No links to check\./);
});