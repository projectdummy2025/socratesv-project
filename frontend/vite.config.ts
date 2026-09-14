import { defineConfig } from 'vite';

export default defineConfig({
  // Load .env from workspace root
  envDir: '../',
  // Expose env variables matching .env and VITE_ convention
  envPrefix: ['VITE_', 'PORT_', 'BACKEND_', 'PYTHON_'],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3455',
        changeOrigin: true,
      },
    },
  },
});
