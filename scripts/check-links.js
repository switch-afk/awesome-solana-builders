#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { checkLinks, extractLinks } = require('./lib/links');

// Tests shorten these so a deliberately broken link does not make them wait.
const fromEnv = (name, fallback) => {
  const value = process.env[name];
  return value !== undefined && value !== '' ? Number(value) : fallback;
};

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const files = args.length > 0 ? args.map((file) => path.resolve(file)) : ['README.md', 'CONTRIBUTING.md'].map((file) => path.join(root, file));
const inActions = process.env.GITHUB_ACTIONS === 'true';
const display = (file) => path.relative(process.cwd(), file) || file;

async function main() {
  const links = [];
  for (const file of files) {
    let text;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch (error) {
      console.error(`Could not read ${file}: ${error.message}`);
      return 2;
    }
    links.push(...extractLinks(text, display(file)));
  }

  const urls = [...new Set(links.map((link) => link.url))];
  if (urls.length === 0) {
    console.log('No links to check.');
    return 0;
  }

  const results = await checkLinks(urls, {
    concurrency: 5,
    timeoutMs: fromEnv('LINK_CHECK_TIMEOUT_MS', 15000),
    retryDelayMs: fromEnv('LINK_CHECK_RETRY_DELAY_MS', 1000),
  });
  const byUrl = new Map(results.map((result) => [result.url, result]));

  for (const link of links) {
    const result = byUrl.get(link.url);
    if (result.status === 'ok') continue;

    const message = `${link.url} - ${result.detail}`;
    if (inActions) {
      const level = result.status === 'fail' ? 'error' : 'warning';
      console.log(`::${level} file=${link.file},line=${link.line}::${message}`);
    } else {
      const label = result.status === 'fail' ? 'FAIL' : 'warn';
      console.log(`${link.file}:${link.line}  ${label}  ${message}`);
    }
  }

  const count = (status) => results.filter((result) => result.status === status).length;
  const failed = count('fail');
  const warnings = count('warn');
  console.log(
    `Checked ${urls.length} link${urls.length === 1 ? '' : 's'}: ${count('ok')} ok, ${warnings} warning${warnings === 1 ? '' : 's'}, ${failed} failed.`
  );

  return failed > 0 ? 1 : 0;
}

main().then(
  (code) => {
    process.exitCode = code;
  },
  (error) => {
    console.error(`Unexpected error: ${error.message}`);
    process.exitCode = 1;
  }
);