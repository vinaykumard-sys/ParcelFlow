import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './', // Crucial for Android WebView file:///android_asset/www/
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'lucide-react': path.resolve(__dirname, '../src/lucide-shim.ts'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../assets_www_dist'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,
  },
});
