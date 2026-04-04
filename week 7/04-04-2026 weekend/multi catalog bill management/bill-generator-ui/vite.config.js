import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // When VITE_API_URL is not set, the UI calls `/api/...` on the same origin; Vite forwards to the .NET API.
    proxy: {
      '/api': {
        target: 'http://localhost:5235',
        changeOrigin: true,
      },
    },
  },
})
