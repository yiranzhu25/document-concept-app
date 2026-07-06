import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/document-concept-app/',
  server: {
    // Honor a harness-assigned port (autoPort) and fail loudly instead of
    // silently incrementing to a port the preview proxy isn't watching.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: true,
  },
})
