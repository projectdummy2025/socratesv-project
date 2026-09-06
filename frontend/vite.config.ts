import { defineConfig } from 'vite';

export default defineConfig({
  // Load .env from workspace root
  envDir: '../',
  // Expose env variables matching .env and VITE_ convention
  envPrefix: ['VITE_', 'SUPABASE_', 'PORT_', 'BACKEND_', 'PYTHON_'],
  server: {
    port: 3000,
    host: true,
  },
});
