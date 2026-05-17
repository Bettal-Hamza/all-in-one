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
          if (id.includes('@imgly/background-removal')) return 'vendor-bg-removal'
          if (id.includes('@ffmpeg'))                   return 'vendor-ffmpeg'
          if (id.includes('pdf-lib'))                   return 'vendor-pdf'
          if (id.includes('framer-motion'))             return 'vendor-motion'
          if (id.includes('qrcode.react'))              return 'vendor-qr'
          if (id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react/') ||
              id.includes('react-router-dom'))          return 'vendor-react'
        },
      },
    },
  },
})
