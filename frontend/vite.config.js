import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Send /api requests to the backend, so the browser sees one site and the login cookie works.
    proxy: { '/api': 'http://localhost:5000' },
  },
})
