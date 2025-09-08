#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function listTsx(dir) {
  const res = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) res.push(...listTsx(p));
    else if (entry.isFile() && p.endsWith('.tsx')) res.push(p);
  }
  return res;
}

function hasReactImport(src) {
  return /import\s+React\s+from\s+['"]react['"];?/.test(src);
}

function ensureReactImport(file) {
  const src = fs.readFileSync(file, 'utf8');
  if (hasReactImport(src)) return false;
  const lines = src.split(/\r?\n/);
  let idx = 0;
  if (/^\s*"use client";?\s*$/.test(lines[0])) idx = 1;
  lines.splice(idx, 0, "import React from 'react';");
  fs.writeFileSync(file, lines.join('\n'));
  return true;
}

const root = path.join(process.cwd(), 'web');
const files = listTsx(root);
let changed = 0;
for (const f of files) {
  if (ensureReactImport(f)) changed++;
}
console.log(`Checked ${files.length} .tsx files; inserted React import in ${changed}.`);

