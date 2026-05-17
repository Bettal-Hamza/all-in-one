import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function asyncCssPlugin() {
  return {
    name: 'async-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet"([^>]*?)href="([^"]*?)"([^>]*?)>/g,
        '<link rel="preload" as="style"$1href="$2"$3 onload="this.onload=null;this.rel=\'stylesheet\'">\n    <noscript><link rel="stylesheet"$1href="$2"$3></noscript>'
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), asyncCssPlugin()],
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
