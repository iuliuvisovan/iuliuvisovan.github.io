import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The live site is served from the repo root as a GitHub Pages project site,
// so this app lives at /adam/. Source stays here in adam-app/; the production
// build is emitted straight into ../adam (which Pages serves verbatim).
export default defineConfig({
  base: '/adam/',
  plugins: [react()],
  build: {
    outDir: '../adam',
    emptyOutDir: true,
  },
})
