import { defineConfig } from 'vite'
import { execSync } from 'child_process';
import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import vlnAuthoring from './tools/vln-authoring/plugin.mjs'

// Local dev is served over HTTPS at https://localhost.alvarado.dev:2727
// (localhost.alvarado.dev resolves to 127.0.0.1 via public DNS — no /etc/hosts needed).
const HOST = 'localhost.alvarado.dev'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: HOST,
    port: 2727,
    allowedHosts: [HOST],
  },
  plugins: [
    react(),
    tailwindcss(),
    mkcert({ hosts: [HOST] }),
    vlnAuthoring(),
    {
      name: 'optimize-images-plugin',
      buildStart() {
        execSync('node optimize-images.mjs', { stdio: 'inherit' });
      }
    }
  ],
})
