import { defineConfig } from 'vite'
import { execSync } from 'child_process';
import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Local dev is served over HTTPS at https://localhost.alvarado.dev:2727
// (localhost.alvarado.dev resolves to 127.0.0.1 via public DNS — no /etc/hosts needed).
const HOST = 'localhost.alvarado.dev'

export default defineConfig({
  server: {
    host: HOST,
    port: 2727,
    allowedHosts: [HOST],
  },
  preview: {
    port: 4173,
  },
  plugins: [
    react(),
    tailwindcss(),
    mkcert({ hosts: [HOST] }),
    // mkcert turns HTTPS on for `vite preview` too; Playwright's local e2e
    // webServer can't health-check its self-signed cert, so keep preview
    // plain HTTP. Must come after mkcert to win the config merge.
    {
      name: 'http-preview',
      config: () => ({ preview: { https: false } }),
    },
    {
      name: 'optimize-images-plugin',
      buildStart() {
        execSync('node optimize-images.mjs', { stdio: 'inherit' });
      }
    }
  ],
})
