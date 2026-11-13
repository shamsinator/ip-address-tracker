import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  }
})
