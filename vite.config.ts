import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace '/study-notes-platform/' with your specific GitHub Pages repo name if needed
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
