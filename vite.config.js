import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Removidos headers restritivos (COEP/COOP) para permitir fetch de APIs externas (HF, Clipdrop)
      // e carregamento de imagens de terceiros (Unsplash, Pexels) sem erros de CORS severos.
      'Access-Control-Allow-Origin': '*',
    }
  }
})
