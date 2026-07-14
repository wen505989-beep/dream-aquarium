import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/dream-aquarium/' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
