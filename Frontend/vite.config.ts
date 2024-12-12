import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    port: Number(process.env.VITE_PORT) || 4000,  // Convert to number or fallback to 3000
  },
});
