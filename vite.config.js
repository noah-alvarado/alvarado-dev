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
    {
      name: 'optimize-images-plugin',
      buildStart() {
        execSync('node optimize-images.mjs', { stdio: 'inherit' });
      }
    }
  ],
})
