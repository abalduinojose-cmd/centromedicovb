import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => ({
  // GitHub Pages serve o site em /centromedicovb/; o dev local continua na raiz.
  base: command === 'build' ? '/centromedicovb/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
}));
