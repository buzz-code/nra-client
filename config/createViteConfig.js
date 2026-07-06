import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Creates a standard Vite config for NRA client applications.
 * Port is read from the PORT environment variable so each project
 * can be assigned a unique port in docker-compose.override.yml.
 *
 * @param {object} [options]
 * @param {string} [options.apiUrlEnvKey='REACT_APP_API_URL'] - env key for the API URL
 */
export function createViteConfig(options = {}) {
  const { apiUrlEnvKey = 'REACT_APP_API_URL' } = options;

  return ({ command }) => {
    const port = Number(process.env.PORT || 3000);
    const nodeEnv = command === 'build' ? 'production' : 'development';

    return defineConfig({
      envPrefix: 'REACT_APP',
      plugins: [react()],
      // Use a project-local cache dir so multiple projects sharing the same
      // node_modules directory don't overwrite each other's Vite pre-bundle cache.
      cacheDir: path.resolve(process.cwd(), '.vite-cache'),
      server: {
        host: '0.0.0.0',
        port,
        hmr: {
          overlay: true,
          // In Vite 2.x the HMR WebSocket shares the main HTTP server port.
          // Setting a separate hmr.port/clientPort breaks the WS connection.
        },
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify(nodeEnv),
        [`process.env.${apiUrlEnvKey}`]: JSON.stringify(process.env[apiUrlEnvKey] ?? ''),
      },
      resolve: {
        alias: {
          '@shared': path.resolve(process.cwd(), './shared'),
          src: path.resolve(process.cwd(), './src'),
        },
      },
      build: {
        // react, MUI, react-admin/ra-core, and ra-ui-materialui are tightly
        // interdependent (MUI depends on react, react-admin depends on both,
        // etc.) — splitting them into separate chunks broke module init order
        // (circular chunk loading -> "Cannot read properties of undefined
        // (reading '__esModule')" at runtime). Keep them together in the
        // default vendor chunk. Only xlsx and the openobserve telemetry SDKs
        // have no dependency on that framework stack, so they're safe to
        // split out on their own.
        chunkSizeWarningLimit: 2500,
        rollupOptions: {
          output: {
            manualChunks: {
              'xlsx-vendor': ['xlsx'],
              'openobserve-vendor': ['@openobserve/browser-rum', '@openobserve/browser-logs'],
            },
          },
          onwarn(warning, warn) {
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
            warn(warning);
          },
        },
      },
    });
  };
}
