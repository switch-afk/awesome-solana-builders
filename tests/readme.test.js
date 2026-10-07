'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const { lintReadme } = require('../scripts/lib/lint');

const root = path.join(__dirname, '..');
const script = path.join(root, 'scripts', 'lint-readme.js');

test('the real README passes its own rules', () => {
  const text = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.deepEqual(lintReadme(text).problems, []);
});

test('the lint command exits 0 on the real README', () => {
  const result = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /no problems/);
});

test('the lint command exits 1 and names the line on a broken README', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-'));
  const file = path.join(dir, 'README.md');
  fs.writeFileSync(
    file,
    '# T\n\n## Contents\n\n- [Tools](#tools)\n\n## Tools\n\n- Just some text\n'
  );

  const result = spawnSync(process.execPath, [script, file], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /:9: Entry must look like/);
  assert.match(result.stderr, /1 problem\./);
});

test('the lint command exits 2 when the file cannot be read', () => {
  const result = spawnSync(process.execPath, [script, '/no/such/README.md'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Could not read/);
});