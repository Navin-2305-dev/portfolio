import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGithub = process.env.DEPLOY_TARGET === 'GH';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isGithub ? "/portfolio/" : "/",
})
