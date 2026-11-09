import { defineConfig } from 'vite';

// GitHub Pages project path; the standalone index.html remains directly playable offline.
export default defineConfig({
  base: '/trading-bear-cubs/',
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2022' },
  server: { port: 5173, strictPort: true },
});
