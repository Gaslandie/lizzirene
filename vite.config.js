import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Le site est publié à la racine de https://lizzirenedeco.com.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
