import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  build: {
    assetsDir: 'images',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // const module = id.split('node_modules/').pop().split('/')[0];
            // return `vendor-${module}`;
            return `vendor`;
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
});
