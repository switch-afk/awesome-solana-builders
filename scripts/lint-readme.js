#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { lintReadme } = require('./lib/lint');

const file = process.argv[2] || path.join(__dirname, '..', 'README.md');

let text;
try {
  text = fs.readFileSync(file, 'utf8');
} catch (error) {
  console.error(`Could not read ${file}: ${error.message}`);
  process.exit(2);
}

const { problems, entryCount, categoryCount } = lintReadme(text);
const name = path.relative(process.cwd(), file) || file;

if (problems.length > 0) {
  for (const problem of problems) {
    console.error(`${name}:${problem.line}: ${problem.message}`);
  }
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}.`);
  process.exit(1);
}

console.log(`${name}: ${entryCount} entries in ${categoryCount} categories, no problems.`);