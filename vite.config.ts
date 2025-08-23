import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['primevue', '@primevue/themes', '@primevue/icons']
        }
      }
    }
  },
  server: {
    port: 5174,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  }
})
