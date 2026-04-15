import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const localUrl = env.VITE_APPS_SCRIPT_URL_LOCAL?.trim();
  const productionUrl = env.VITE_APPS_SCRIPT_URL?.trim();
  const legacyUrl = env.VITE_API_URL?.trim();
  const proxyTarget = localUrl || productionUrl || legacyUrl;
  const parsedProxyTarget = proxyTarget ? new URL(proxyTarget) : null;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: parsedProxyTarget
        ? {
            '/api': {
              target: parsedProxyTarget.origin,
              changeOrigin: true,
              rewrite: (rawPath) => `${parsedProxyTarget.pathname}${rawPath.replace(/^\/api/, '')}`,
            },
          }
        : undefined,
    },
  };
});
