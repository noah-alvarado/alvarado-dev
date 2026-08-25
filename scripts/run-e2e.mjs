// Runs Playwright e2e tests against the local HTTPS preview server.
//
// vite-plugin-mkcert provisions a local CA at ~/.vite-plugin-mkcert/rootCA.pem
// (same default path on macOS/Linux). Node only reads NODE_EXTRA_CA_CERTS at
// process start, so we must set it here before Playwright launches: its
// webServer readiness probe does plain TLS verification with no way to skip
// it, and the mkcert cert is only trusted if this CA is loaded.
//
// If the CA doesn't exist yet (fresh machine), warn and continue — the user
// needs to run `yarn dev` once to provision certs before e2e can work.
// In CI this is moot: E2E_BASE_URL points at a preview with a real ACM cert.
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const caPath = join(homedir(), '.vite-plugin-mkcert', 'rootCA.pem');
const env = { ...process.env };

if (existsSync(caPath)) {
  env.NODE_EXTRA_CA_CERTS = caPath;
} else {
  console.warn(
    `[e2e] mkcert CA not found at ${caPath}. Run \`yarn dev\` once to provision\n` +
    '[e2e] local HTTPS certificates, then re-run.',
  );
}

const { status } = spawnSync('npx', ['playwright', 'test'], {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32',
});

process.exit(status ?? 1);
