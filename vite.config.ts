import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';
import virtual from '@rollup/plugin-virtual';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cesium()
    // virtual({
    //   ol: `
    //   import ol from 'ol';
    //   window.ol = ol;
    //   export default ol;
    // `
    // })
  ]
});
