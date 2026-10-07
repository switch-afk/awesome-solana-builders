'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { lintReadme, slugify } = require('../scripts/lib/lint');

const doc = (body, { contents = ['- [Tools](#tools)'] } = {}) =>
  [
    '# Awesome Solana Builders',
    '',
    '## Contents',
    '',
    ...contents,
    '',
    '## Tools',
    '',
    body,
    '',
    '## License',
    '',
    'CC0',
    '',
  ].join('\n');

const messages = (text) => lintReadme(text).problems.map((problem) => problem.message);
const entry = (name, url, description) => `- [${name}](${url}) - ${description}`;

const VALID = [
  entry('Alpha', 'https://alpha.example', 'Does the alpha thing.'),
  entry('Beta', 'https://beta.example/docs', 'Does the beta thing.'),
].join('\n');

test('slugify matches GitHub anchors', () => {
  assert.equal(slugify('RPC providers & infrastructure'), 'rpc-providers--infrastructure');
  assert.equal(slugify('Learning resources'), 'learning-resources');
});

test('a well-formed list has no problems and is counted', () => {
  const result = lintReadme(doc(VALID));
  assert.deepEqual(result.problems, []);
  assert.equal(result.entryCount, 2);
  assert.equal(result.categoryCount, 1);
});

test('entries must have an https link and a description', () => {
  assert.match(messages(doc('- [Alpha](http://alpha.example) - Does a thing.'))[0], /Entry must look like/);
  assert.match(messages(doc('- [Alpha](https://alpha.example)'))[0], /Entry must look like/);
  assert.match(messages(doc('- Just some text'))[0], /Entry must look like/);
});

test('problems point at the right line', () => {
  const result = lintReadme(doc('- Just some text'));
  assert.equal(result.problems[0].line, 9);
});

test('descriptions must start with a capital and end with a period', () => {
  assert.match(messages(doc(entry('Alpha', 'https://alpha.example', 'does a thing.')))[0], /capital letter/);
  assert.match(messages(doc(entry('Alpha', 'https://alpha.example', 'Does a thing')))[0], /end with a period/);
});

test('descriptions are capped in length', () => {
  const long = `A${'a'.repeat(210)}.`;
  assert.match(messages(doc(entry('Alpha', 'https://alpha.example', long)))[0], /characters/);
});

test('descriptions are one sentence, but abbreviations are fine', () => {
  assert.match(
    messages(doc(entry('Alpha', 'https://alpha.example', 'Does one thing. Does another.')))[0],
    /one sentence/
  );
  assert.deepEqual(
    messages(doc(entry('Alpha', 'https://alpha.example', 'Fetches data, e.g. prices and balances.'))),
    []
  );
});

test('marketing words are rejected, similar words are not', () => {
  assert.match(
    messages(doc(entry('Alpha', 'https://alpha.example', 'The best RPC for everything.')))[0],
    /marketing words \("best"\)/
  );
  assert.deepEqual(messages(doc(entry('Alpha', 'https://alpha.example', 'Benchmarks latency.'))), []);
});

test('entries must be alphabetical, ignoring case', () => {
  const wrong = [
    entry('Beta', 'https://beta.example', 'Does beta.'),
    entry('Alpha', 'https://alpha.example', 'Does alpha.'),
  ].join('\n');
  assert.match(messages(doc(wrong))[0], /"Alpha" should come before "Beta"/);

  const mixed = [
    entry('alpha', 'https://alpha.example', 'Does alpha.'),
    entry('Beta', 'https://beta.example', 'Does beta.'),
  ].join('\n');
  assert.deepEqual(messages(doc(mixed)), []);
});

test('the same link cannot be listed twice, even with a different host case or trailing slash', () => {
  const body = [
    entry('Alpha', 'https://alpha.example/', 'Does alpha.'),
    entry('Beta', 'https://ALPHA.example', 'Does beta.'),
  ].join('\n');
  assert.match(messages(doc(body))[0], /already listed on line 9/);
});

test('the same name cannot appear twice in a section', () => {
  const body = [
    entry('Alpha', 'https://one.example', 'Does one.'),
    entry('Alpha', 'https://two.example', 'Does two.'),
  ].join('\n');
  assert.match(messages(doc(body))[0], /appears twice/);
});

test('a link that is not a valid URL is reported', () => {
  assert.match(messages(doc(entry('Alpha', 'https://[', 'Does alpha.')))[0], /not a valid URL/);
});

test('the maintainer must disclose their own projects', () => {
  const url = 'https://github.com/switch-afk/mint-check';
  assert.match(messages(doc(entry('mint-check', url, 'Checks a token mint.')))[0], /own projects/);
  assert.deepEqual(
    messages(doc(entry('mint-check', url, 'Checks a token mint (by the maintainer).'))),
    []
  );
});

test('every category must be in Contents, and Contents must not point at nothing', () => {
  assert.match(messages(doc(VALID, { contents: [] }))[0], /missing from Contents/);
  assert.match(
    messages(doc(VALID, { contents: ['- [Tools](#tools)', '- [Ghost](#ghost)'] }))[0],
    /#ghost/
  );
});

test('a category with no entries is reported', () => {
  assert.match(messages(doc(''))[0], /has no entries/);
});

test('code fences are ignored, so the README can show the entry format', () => {
  const body = ['```', '- [Bad](http://x) - nope', '```', VALID].join('\n');
  assert.deepEqual(messages(doc(body)), []);
});

test('sections that are not categories are not checked as entries', () => {
  const text = `${doc(VALID)}\n## How entries are chosen\n\n- not an entry\n- [x](http://bad)\n`;
  assert.deepEqual(messages(text), []);
});

test('sub-sections restart the alphabetical order', () => {
  const body = [
    '### First',
    entry('Zed', 'https://zed.example', 'Does zed.'),
    '### Second',
    entry('Alpha', 'https://alpha.example', 'Does alpha.'),
  ].join('\n');
  assert.deepEqual(messages(doc(body)), []);
});