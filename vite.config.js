import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Le site est servi depuis https://gaslandie.github.io/lizzirene/ :
// les fichiers de /public doivent donc être préfixés par ce chemin.
// Pour un hébergement à la racine du domaine (Vercel, nom de domaine
// personnalisé), repasser `base` à '/'.
export default defineConfig({
  base: '/lizzirene/',
  plugins: [react()],
})
