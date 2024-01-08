import { defineConfig } from 'vite';
// The default Vite plugin for React projects.
import react from '@vitejs/plugin-react';
// Write your styles in TypeScript (or JavaScript) with locally scoped class names and CSS Variables, then generate static CSS files at build time.
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
// A Vite plugin that generates declaration files (*.d.ts) from .ts(x) or .vue source files when using Vite in library mode.
import dts from 'vite-plugin-dts';
// A Rollup plugin which locates modules using the Node resolution algorithm, for using third party modules in node_modules
import nodeResolve from '@rollup/plugin-node-resolve';
// Automatically externalize peerDependencies in a rollup bundle.
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin({
      identifiers: ({ hash }) => `uk_${hash}`,
    }),
    dts(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      formats: ['es'],
      entry: {
        index: 'src/index.ts',
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'viem', 'wagmi', '@bnb-chain/greenfield-js-sdk'],
      plugins: [peerDepsExternal(), nodeResolve()],
      output: {
        chunkFileNames: 'common.js',
      },
    },
  },
});
