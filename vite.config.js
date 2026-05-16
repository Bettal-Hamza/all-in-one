import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Heavy AI library — only loads on /tools/background-remover
          if (id.includes('@imgly/background-removal')) return 'vendor-bg-removal'
          if (id.includes('@ffmpeg'))                   return 'vendor-ffmpeg'
          // PDF engine — only loads on /tools/pdf-splitter
          if (id.includes('pdf-lib'))                  return 'vendor-pdf'
          // Animation library — shared but large; isolate for long-term caching
          if (id.includes('framer-motion'))            return 'vendor-motion'
          // React core — rarely changes, maximise cache life
          if (id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react/') ||
              id.includes('react-router-dom'))         return 'vendor-react'
        },
      },
    },
  },
})
