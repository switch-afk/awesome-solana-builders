'use strict';

const MAINTAINER_PREFIX = 'https://github.com/switch-afk/';
const MAINTAINER_MARKER = '(by the maintainer)';
const MAX_DESCRIPTION = 200;

// Words that say nothing about what a tool does. Say what it does instead.
const MARKETING_WORDS = [
  'best',
  'blazing',
  'blazingly',
  'cutting-edge',
  'game-changer',
  'game-changing',
  'leading',
  'next-generation',
  'revolutionary',
  'ultimate',
  'unmatched',
  'world-class',
  "world's",
  '#1',
];

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MARKETING = new RegExp(
  `(^|[^a-z])(${MARKETING_WORDS.map(escapeRegExp).join('|')})(?![a-z0-9])`,
  'i'
);

const ENTRY = /^- \[([^\]]+)\]\((https:\/\/[^)\s]+)\) - (.+)$/;
const CONTENTS_LINK = /^- \[([^\]]+)\]\(#([^)\s]+)\)\s*$/;
const ENTRY_HELP = 'Entry must look like "- [Name](https://example.com) - One sentence."';

// Sections that are not categories of entries.
const NON_CATEGORY = new Set(['Contents', 'How entries are chosen', 'Contributing', 'License']);

/** GitHub's anchor for a heading: "RPC providers & tools" -> "rpc-providers--tools". */
function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/ /g, '-');
}

/** host + path without a trailing slash, so near-identical links count as the same. */
function normalizeUrl(url) {
  const parsed = new URL(url);
  return `${parsed.host}${parsed.pathname.replace(/\/+$/, '')}${parsed.search}`;
}

function checkDescription(description, url) {
  const messages = [];

  if (!/^[A-Z]/.test(description)) {
    messages.push('Description must start with a capital letter.');
  }
  if (!description.endsWith('.')) {
    messages.push('Description must end with a period.');
  }
  if (description.length > MAX_DESCRIPTION) {
    messages.push(
      `Description is ${description.length} characters; keep it under ${MAX_DESCRIPTION}.`
    );
  }

  const withoutAbbreviations = description.replace(/\b(e\.g\.|i\.e\.|etc\.)/gi, '');
  if (/[a-z0-9)][.!?] [A-Z]/.test(withoutAbbreviations)) {
    messages.push('Keep the description to one sentence.');
  }

  const marketing = MARKETING.exec(description);
  if (marketing) {
    messages.push(`Avoid marketing words ("${marketing[2]}"). Say what it does instead.`);
  }

  if (url.toLowerCase().startsWith(MAINTAINER_PREFIX) && !description.includes(MAINTAINER_MARKER)) {
    messages.push(`Entries for the maintainer's own projects must say "${MAINTAINER_MARKER}".`);
  }

  return messages;
}

/**
 * Check a README against the list's rules.
 * Returns { problems: [{ line, message }], entryCount, categoryCount }.
 */
function lintReadme(text) {
  const problems = [];
  const report = (line, message) => problems.push({ line, message });

  const headings = [];
  const contentsLinks = [];
  const seenUrls = new Map();
  const entriesPerSection = new Map();

  let section = null;
  let inContents = false;
  let inFence = false;
  let previousName = null;
  let namesInSection = new Set();
  let entryCount = 0;

  const isCategory = () => section !== null && !NON_CATEGORY.has(section);

  text.split(/\r?\n/).forEach((line, index) => {
    const lineNumber = index + 1;

    if (line.startsWith('```')) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    if (line.startsWith('## ')) {
      section = line.slice(3).trim();
      headings.push({ line: lineNumber, title: section, slug: slugify(section) });
      inContents = section === 'Contents';
      previousName = null;
      namesInSection = new Set();
      if (isCategory()) entriesPerSection.set(section, 0);
      return;
    }

    if (line.startsWith('### ')) {
      previousName = null;
      namesInSection = new Set();
      return;
    }

    if (inContents) {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const link = CONTENTS_LINK.exec(line);
        if (link) contentsLinks.push({ line: lineNumber, slug: link[2] });
        else report(lineNumber, 'Contents entries must look like "- [Name](#name)".');
      }
      return;
    }

    if (!isCategory()) return;
    if (!line.startsWith('- ') && !line.startsWith('* ')) return;

    // Any bullet in a category is an entry attempt, even a malformed one,
    // so a section is only "empty" when it has no bullets at all.
    entriesPerSection.set(section, entriesPerSection.get(section) + 1);

    const match = ENTRY.exec(line);
    if (!match) {
      report(lineNumber, ENTRY_HELP);
      return;
    }

    const [, name, url, description] = match;
    entryCount += 1;

    for (const message of checkDescription(description, url)) {
      report(lineNumber, message);
    }

    try {
      const key = normalizeUrl(url);
      if (seenUrls.has(key)) {
        report(lineNumber, `This link is already listed on line ${seenUrls.get(key)}.`);
      } else {
        seenUrls.set(key, lineNumber);
      }
    } catch {
      report(lineNumber, 'Link is not a valid URL.');
    }

    if (namesInSection.has(name.toLowerCase())) {
      report(lineNumber, `Name "${name}" appears twice in this section.`);
    }
    namesInSection.add(name.toLowerCase());

    if (previousName !== null && name.toLowerCase() < previousName.toLowerCase()) {
      report(lineNumber, `"${name}" should come before "${previousName}" (entries are alphabetical).`);
    }
    previousName = name;
  });

  const categories = headings.filter((heading) => !NON_CATEGORY.has(heading.title));
  const contentsSlugs = new Set(contentsLinks.map((link) => link.slug));
  const headingSlugs = new Set(headings.map((heading) => heading.slug));

  for (const heading of categories) {
    if (!contentsSlugs.has(heading.slug)) {
      report(heading.line, `Section "${heading.title}" is missing from Contents.`);
    }
    if (entriesPerSection.get(heading.title) === 0) {
      report(heading.line, `Section "${heading.title}" has no entries.`);
    }
  }
  for (const link of contentsLinks) {
    if (!headingSlugs.has(link.slug)) {
      report(link.line, `Contents links to #${link.slug} but no such section exists.`);
    }
  }

  problems.sort((a, b) => a.line - b.line);
  return { problems, entryCount, categoryCount: categories.length };
}

module.exports = {
  MAINTAINER_MARKER,
  MAINTAINER_PREFIX,
  MAX_DESCRIPTION,
  lintReadme,
  normalizeUrl,
  slugify,
};