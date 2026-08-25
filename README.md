# alvarado-dev

A modern React + Vite web application hosted on **AWS** (S3 + CloudFront + Route 53),
with infrastructure defined as code via **AWS CDK** and CI/CD through GitHub Actions.

## Features

- ⚡️ Fast development with [Vite](https://vitejs.dev/)
- ⚛️ React for UI development
- 🎨 Tailwind CSS for styling
- 🧹 Linting with ESLint
- 🧪 Unit tests with [Vitest](https://vitest.dev/) + e2e with [Playwright](https://playwright.dev/)
- ☁️ AWS S3 + CloudFront hosting, provisioned with [AWS CDK](./infra)
- 🔀 Per-PR preview environments at `pr-<n>.preview.alvarado.dev`
- 🛠️ GitHub Actions CI/CD with keyless (OIDC) AWS auth
- 📦 Optimized images for performance

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v26)
- [Yarn](https://yarnpkg.com/)

### Installation

```sh
yarn install
```

### Development

Start the dev server:

```bash
yarn dev
```

Local development is served over HTTPS at `https://localhost.alvarado.dev:2727`.

`localhost.alvarado.dev` resolves to `127.0.0.1` via public DNS, so no local `/etc/hosts` setup is required.

Locally-trusted HTTPS certificates are generated automatically via
[vite-plugin-mkcert](https://github.com/liuweiGL/vite-plugin-mkcert); the first
run may prompt for your password to install the local CA.

### Linting & Code Quality

```bash
yarn lint        # or yarn lint:fix
```

### Testing

```bash
yarn test        # unit (Vitest)
yarn test:e2e    # e2e (Playwright) — builds + serves locally over HTTPS, or set E2E_BASE_URL
```

Local e2e serves over HTTPS using the same mkcert certificates as the dev
server; run `yarn dev` once first if you haven't, so the certificates are
provisioned.

### Building for Production

```bash
yarn build
```

## Infrastructure (AWS CDK)

All AWS resources live in [`infra/`](./infra) as a TypeScript CDK app:

- **`DnsStack`** — Route 53 hosted zone + email/verification records.
- **`SiteStack`** — private S3 buckets (CloudFront OAC), ACM certs, prod + preview
  CloudFront distributions, Route 53 aliases, and a GitHub Actions OIDC deploy role.

See [`infra/README.md`](./infra/README.md) for the bootstrap + deploy runbook
(including the one-time Route 53 nameserver cutover).

## Deployment

Deploys run in GitHub Actions using an OIDC-assumed IAM role (no stored AWS keys).
Required repo **Variables**: `AWS_DEPLOY_ROLE_ARN` and `AWS_REGION` only — the
deploy scripts read buckets/distribution IDs from `SiteStack` CloudFormation
outputs at runtime via the [`stack-outputs` action](./.github/actions/stack-outputs).

- **Every PR** (`.github/workflows/pr.yml`): unit tests → deploy to a preview at
  `https://pr-<n>.preview.alvarado.dev` (sticky PR comment) → Playwright e2e against it.
- **Merge to `main`** (`.github/workflows/deploy-prod.yml`): deploy to production,
  then tag the release `release-<short-sha>` on success.
- **PR close** (`.github/workflows/pr-cleanup.yml`): remove that PR's preview objects.

Manual deploys (need AWS credentials for account `034083889387` in `us-east-1`,
plus the same env vars the CI action loads from stack outputs):

```bash
PROD_BUCKET=... PROD_DISTRIBUTION_ID=... yarn deploy:prod
PREVIEW_BUCKET=... PREVIEW_BASE_DOMAIN=preview.alvarado.dev PR_NUMBER=123 yarn deploy:preview
```

## Image Optimization

Optimized images are stored in `public/optimized/`. This process is automatic as a part of the build process. See [`optimize-images.mjs`](./optimize-images.mjs) for details.

## Project Structure

```
/ (root)
├── infra/                   # AWS CDK app (S3 + CloudFront + Route 53)
├── scripts/                 # deploy-prod, deploy-preview
├── .github/
│   ├── workflows/           # CI/CD (pr, deploy-prod, pr-cleanup)
│   └── actions/             # composite actions (setup, stack-outputs)
├── e2e/                     # Playwright specs
├── optimize-images.mjs      # Image optimization script
├── public/                  # Static assets
├── src/                     # Source code
│   ├── components/          # React components
│   ├── pages/               # Page components (one per route)
│   ├── hooks/               # Hooks (useTheme, useWindowWidth)
│   ├── assets/              # Image assets
│   ├── styles/              # CSS/JS styles
│   ├── test/                # Vitest setup
│   └── routes.jsx           # Route table consumed by App.jsx
├── AGENTS.md                # Guide for coding agents (also linked by CLAUDE.md)
├── package.json             # Project metadata and scripts
├── vite.config.js           # Vite config
├── vitest.config.js         # Unit test config
├── playwright.config.js     # E2e test config
└── README.md                # This file
```

> Working with an AI agent in this repo? See [`AGENTS.md`](./AGENTS.md).


## License

This software and its source code are proprietary and confidential. No part of this codebase may be copied, reproduced, distributed, or transmitted in any form or by any means, electronic or mechanical, including photocopying, recording, or any information storage and retrieval system, without the express written permission of the copyright holder.

Unauthorized use, reproduction, or distribution of this code, or any portion of it, is strictly prohibited.
