import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // Builds (and so `npm run deploy`) use the GitHub Pages project path,
  // https://sm2irfan.github.io/dynamicDeltaWb/, as does `npm run preview`,
  // which serves that build. The dev server runs at the root instead, so
  // local development is simply http://localhost:5173/.
  base: command === 'serve' && !isPreview ? '/' : '/dynamicDeltaWb/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // listen on the LAN, so `npm run dev` alone is enough
    port: 5173,
    strictPort: true, // fail loudly instead of drifting to another port
    // Trust tunnel hostnames (cloudflared / ngrok) so phone testing works.
    // Dev server only — never used in the production build.
    allowedHosts: ['.trycloudflare.com', '.ngrok-free.app', '.ngrok.io'],
  },
}))
