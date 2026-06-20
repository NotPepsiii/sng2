import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/sng2/", // EXACT repo name for GitHub Pages
  build: {
    outDir: "dist",
    assetsDir: "assets",
  }
});
