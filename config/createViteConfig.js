import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Creates a standard Vite config for NRA client applications.
 * Port and HMR port are read from environment variables (PORT, HMR_PORT)
 * so each project can be assigned a unique block in docker-compose.override.yml.
 *
 * @param {object} [options]
 * @param {string} [options.apiUrlEnvKey='REACT_APP_API_URL'] - env key for the API URL
 */
export function createViteConfig(options = {}) {
  const { apiUrlEnvKey = 'REACT_APP_API_URL' } = options;

  return ({ mode }) => {
    const port = Number(process.env.PORT || 3000);
    const hmrPort = Number(process.env.HMR_PORT || port);

    return defineConfig({
      envPrefix: 'REACT_APP',
      plugins: [react()],
      server: {
        host: '0.0.0.0',
        port,
        hmr: {
          overlay: true,
          port: hmrPort,
          timeout: 1000,
          clientPort: hmrPort,
          host: 'localhost',
        },
      },
      define: {
        'process.env.NODE_ENV': `"${mode}"`,
        [`process.env.${apiUrlEnvKey}`]: `"${process.env[apiUrlEnvKey] ?? ''}"`,
      },
      resolve: {
        alias: {
          '@shared': path.resolve(process.cwd(), './shared'),
          src: path.resolve(process.cwd(), './src'),
        },
      },
      build: {
        rollupOptions: {
          onwarn(warning, warn) {
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
            warn(warning);
          },
        },
      },
    });
  };
}
