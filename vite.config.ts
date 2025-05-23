import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { name } from './package.json';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts', // Specifies the entry point for building the library.
      name: name, // Sets the name of the generated library.
      fileName: format => `index.${format}.js`, // Generates the output file name based on the format.
      formats: ['cjs', 'es'], // Specifies the output formats (CommonJS and ES modules).
    },

    sourcemap: true, // Generates source maps for debugging.
    emptyOutDir: true, // Clears the output directory before building.
  },
  plugins: [dts({ entryRoot: 'src' }), libInjectCss()], // Uses the 'vite-plugin-dts' plugin for generating TypeScript declaration files (d.ts).
});
