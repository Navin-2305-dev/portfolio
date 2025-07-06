// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For Vercel, the base path is always the root '/'.
  // You can either omit the 'base' property entirely (it defaults to '/')
  // or explicitly set it for clarity. Both work.
  // base: "/", 
})