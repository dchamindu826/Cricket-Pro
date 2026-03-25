import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ], // <-- methanin plugins array eka close wenna ona
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups', 
      'Cross-Origin-Embedder-Policy': 'unsafe-none',            
    }
  }
})