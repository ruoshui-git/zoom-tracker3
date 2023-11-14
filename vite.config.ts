import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': `style-src 'unsafe-inline' 'self'`,
    },
  },
  build: {
    minify: false,
  },
  plugins: [svelte()],
});
