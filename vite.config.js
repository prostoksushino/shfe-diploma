import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/shfe-diploma/', 
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})