#!/usr/bin/env node
// Build and deploy the production site to S3 + CloudFront.
//
// Env:
//   PROD_BUCKET            target S3 bucket (SiteStack output ProdBucketName)
//   PROD_DISTRIBUTION_ID   CloudFront distribution (SiteStack output ProdDistributionId)
//
// Assets are content-hashed by Vite, so they get a 1-year immutable cache;
// index.html is uploaded no-cache and the distribution is invalidated.
import { execSync } from 'node:child_process';

const bucket = process.env.PROD_BUCKET;
const distributionId = process.env.PROD_DISTRIBUTION_ID;

if (!bucket || !distributionId) {
  console.error('Missing env: PROD_BUCKET and PROD_DISTRIBUTION_ID are required.');
  process.exit(1);
}

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

run('yarn build');

// 1) Everything except index.html with a long immutable cache.
run(
  `aws s3 sync dist "s3://${bucket}" --delete ` +
    `--exclude index.html --cache-control "public,max-age=31536000,immutable"`,
);

// 2) index.html last, never cached, so new deploys are picked up immediately.
run(
  `aws s3 cp dist/index.html "s3://${bucket}/index.html" ` +
    `--cache-control "no-cache,no-store,must-revalidate" --content-type "text/html"`,
);

// 3) Invalidate so the edge drops the previous index.html / error responses.
run(`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/*"`);

console.log('Production deploy complete.');
