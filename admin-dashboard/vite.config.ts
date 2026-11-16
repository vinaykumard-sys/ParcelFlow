import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@backend': path.resolve(import.meta.dirname, '../backend'),
      'lucide-react': path.resolve(import.meta.dirname, '../src/lucide-shim.ts'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
});
