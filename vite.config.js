import { defineConfig } from 'vite'
import { execSync } from 'child_process';
import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 2727,
  },
  plugins: [
    react(),
    tailwindcss(),
    mkcert(),
    {
      name: 'optimize-images-plugin',
      buildStart() {
        execSync('node optimize-images.mjs', { stdio: 'inherit' });
      }
    }
  ],
})
