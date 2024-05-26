import { defineConfig, loadEnv } from 'vite'

import { getSrcPath } from './build/utils'
import { createVitePlugins } from './build/plugin'

// noinspection JSUnusedGlobalSymbols
export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd())

  return {
    server: {
      host: '0.0.0.0'
    },
    resolve: {
      alias: {
        '@': getSrcPath()
      }
    },
    plugins: createVitePlugins(),
    build: {
      outDir: 'dist',
      target: 'chrome86',
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1024
    }
  }
})
