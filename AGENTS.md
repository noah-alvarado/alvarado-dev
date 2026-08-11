# AGENTS.md — agent guide for alvarado-dev

Personal site: **React 19 + Vite 8 + Tailwind v4** SPA, hosted on **AWS (S3 +
CloudFront + Route 53)** with infrastructure as **AWS CDK (TypeScript)** and
CI/CD via **GitHub Actions**. This file orients coding agents; humans should
start with [`README.md`](./README.md).

## Toolchain & package managers (read first)

- **Node 26** (see `.nvmrc`).
- **Root app uses Yarn** (`yarn.lock`). **`infra/` uses npm** (`package-lock.json`).
  Don't cross the streams — run yarn at the root, npm inside `infra/`.
- Pre-commit hook (`.husky/pre-commit`) runs `yarn lint`.

## Commands

Root (run from repo root, Yarn):

| Task            | Command                                    |
| --------------- | ------------------------------------------ |
| Dev server      | `yarn dev` (HTTPS, port 2727)              |
| Build           | `yarn build` (optimizes images, then Vite) |
| Lint / fix      | `yarn lint` / `yarn lint:fix`              |
| Unit tests      | `yarn test` (Vitest)                       |
| E2E tests       | `yarn test:e2e` (Playwright)               |
| Optimize images | `yarn optimize-images`                     |

Infra (run from `infra/`, npm):

| Task            | Command                                   |
| --------------- | ----------------------------------------- |
| Typecheck       | `npm run build` (`tsc --noEmit`)          |
| Synthesize      | `npm run synth`                           |
| Diff            | `npm run diff`                            |
| Deploy          | `npm run deploy:dns` / `:site` / `:all`   |

## Architecture

- **Routing**: routes are declared in `src/routes.jsx` and rendered by
  `src/App.jsx`. Add a page by creating `src/pages/<Name>.jsx` and appending an
  entry to the `routes` array — `App.jsx` maps over it, so nothing else changes.
- **Providers/hooks**: `src/providers/` (`useTheme`, `useWindowWidth`).
- **Styling**: Tailwind v4 via `@tailwindcss/vite`; extra CSS/JS style helpers in
  `src/styles/`.
- **Images**: `optimize-images.mjs` (Sharp) writes to `public/optimized/` and runs
  automatically as a Vite `buildStart` plugin — you rarely invoke it directly.

### Test configuration (a deliberate split)

- **Unit** (`vitest.config.js`): jsdom, its own config so the `optimize-images` /
  `mkcert` Vite plugins never fire during tests. Tests live next to source as
  `*.test.{js,jsx}` plus `scripts/**/*.test.{js,mjs}`.
- **E2E** (`playwright.config.js`, specs in `e2e/`): runs against `E2E_BASE_URL`
  (CI preview) when set, otherwise builds and serves locally via `vite preview`.

## Infrastructure (`infra/`)

AWS CDK app. **The CLI runs the app with native Node** (`cdk.json` →
`node bin/app.ts`) — Node 26 strips TypeScript types at load, so no `ts-node`/
`tsx` loader is involved and `.ts` sources are the source of truth. Because Node
runs the files as **ES modules**, two ESM rules apply: relative imports need an
explicit extension (`import { DnsStack } from '../lib/dns-stack.ts'`) and there is
no `__dirname` (use `import.meta.dirname`). `npm run build` (`tsc --noEmit`) is a
pure typecheck — it emits nothing, so there are no compiled artifacts beside
sources.

- `bin/app.ts` — wires the two stacks; account/region/domain come from `cdk.json`
  context.
- `lib/dns-stack.ts` — Route 53 hosted zone + email/verification records.
- `lib/site-stack.ts` — private S3 buckets (CloudFront OAC), ACM certs, prod +
  preview CloudFront distributions, Route 53 aliases, GitHub OIDC deploy role.
- `lib/preview-rewrite.js` — **hand-written CloudFront Function** (viewer-request)
  for PR previews; it is NOT compiled from TypeScript. It maps
  `pr-<n>.preview.alvarado.dev` to the S3 key prefix `pr-<n>/` with SPA fallback.
  Keep it plain ES for the `cloudfront-js-2.0` runtime.

See [`infra/README.md`](./infra/README.md) for the bootstrap + deploy runbook.

## CI/CD (`.github/`)

- `workflows/pr.yml` — lint + unit → deploy PR preview → Playwright e2e vs preview.
- `workflows/deploy-prod.yml` — on merge to `main`: deploy prod, then tag
  `1.0.0.X` on success (`scripts/next-prod-tag.mjs`).
- `workflows/pr-cleanup.yml` — remove a PR's preview objects on close.
- `actions/stack-outputs/` — composite action that loads `SiteStack` outputs
  (bucket/distribution names) into the job env, so they aren't hardcoded.
- Deploy scripts: `scripts/deploy-prod.mjs`, `scripts/deploy-preview.mjs`.

## Gotchas & conventions

- Dev is served over **HTTPS** at `https://localhost.alvarado.dev:2727`
  (`localhost.alvarado.dev` resolves to `127.0.0.1` via public DNS; certs via
  `vite-plugin-mkcert`). First run may prompt for a password to install the CA.
- The **prod S3 bucket is `RETAIN`** on stack delete (safety); the preview bucket
  is `DESTROY` with auto-delete + 30-day expiry.
- **Known, accepted vuln**: `aws-cdk-lib` bundles a vulnerable `brace-expansion`
  transitively. It can't be overridden (bundled) and is build-time-only CDK
  tooling; it clears once AWS republishes with a patched bundle. Don't add a
  no-op `overrides` pin for it.
- **Intentionally pinned deps** (don't blindly bump to "latest"):
  - `@types/node` tracks the Node runtime major (currently `^26`, matching Node
    26 in `.nvmrc`), not the newest published types. Bump it with the runtime.
  - `infra/tsconfig.json` extends the shared **`@tsconfig/node26`** base (pins
    `module: nodenext` + a Node 26 `target`/`lib`). It must keep
    `"types": ["node"]` — since TS 6, a bare `typeRoots` no longer auto-includes
    `@types/node`, and dropping it breaks `process`/`import.meta`/`Disposable`.
    It also adds `allowImportingTsExtensions` so the `.ts` import specifiers Node
    needs at runtime also typecheck.
- Match existing style: 2-space indent, ES modules, functional React components.
