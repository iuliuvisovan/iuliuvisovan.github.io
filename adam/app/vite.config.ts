import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The live site is served from the repo root as a GitHub Pages project site,
// so this app lives at /adam/. Everything sits under adam/: source here in
// adam/app/, the Cloudflare Worker in adam/worker/, and the production build
// is emitted straight into adam/ itself (which Pages serves verbatim).
// emptyOutDir must stay false so the build never wipes app/ and worker/.
export default defineConfig({
  base: '/adam/',
  plugins: [react()],
  build: {
    outDir: '..',
    emptyOutDir: false,
  },
})
