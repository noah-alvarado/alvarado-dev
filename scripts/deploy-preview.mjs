#!/usr/bin/env node
// Build and deploy a PR preview to s3://$PREVIEW_BUCKET/pr-<n>/.
// Served at https://pr-<n>.$PREVIEW_BASE_DOMAIN via the preview CloudFront
// distribution (host-based prefix rewrite). No invalidation needed — the
// preview distribution has caching disabled.
//
// Env:
//   PREVIEW_BUCKET        target S3 bucket (SiteStack output PreviewBucketName)
//   PR_NUMBER             pull request number
//   PREVIEW_BASE_DOMAIN   e.g. "preview.alvarado.dev"
import { execSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

const bucket = process.env.PREVIEW_BUCKET;
const prNumber = process.env.PR_NUMBER;
const baseDomain = process.env.PREVIEW_BASE_DOMAIN;

if (!bucket || !prNumber || !baseDomain) {
  console.error('Missing env: PREVIEW_BUCKET, PR_NUMBER and PREVIEW_BASE_DOMAIN are required.');
  process.exit(1);
}

const prefix = `pr-${prNumber}`;
const url = `https://${prefix}.${baseDomain}`;
const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

run('yarn build');
run(`aws s3 sync dist "s3://${bucket}/${prefix}" --delete`);

console.log(`Preview deployed: ${url}`);
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `url=${url}\n`);
}
