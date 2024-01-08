import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  root: './dev',
  plugins: [
    react(),
    vanillaExtractPlugin({
      identifiers: ({ hash }) => `uk_${hash}`,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util',
    },
  },
});
