#!/usr/bin/env node
// Compute the next production tag `${package.version}.X`.
//
// Base version comes from package.json (e.g. "1.0.0"); X is one greater than
// the highest existing `<base>.X` git tag, or 0 if none exist.
//
//   import { computeNextTag } from './next-prod-tag.mjs'
//   computeNextTag('1.0.0', ['1.0.0.0', '1.0.0.3']) // -> '1.0.0.4'
//
// CLI: prints the next tag using the local git tags.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

export function computeNextTag(baseVersion, existingTags) {
  const prefix = `${baseVersion}.`;
  const max = existingTags
    .filter((t) => t.startsWith(prefix))
    .map((t) => Number(t.slice(prefix.length)))
    .filter((n) => Number.isInteger(n) && n >= 0)
    .reduce((acc, n) => Math.max(acc, n), -1);
  return `${baseVersion}.${max + 1}`;
}

// Run as a CLI (not when imported by tests).
if (import.meta.url === `file://${process.argv[1]}`) {
  const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
  const tags = execSync('git tag -l', { encoding: 'utf8' }).split('\n').map((t) => t.trim()).filter(Boolean);
  process.stdout.write(computeNextTag(version, tags));
}
