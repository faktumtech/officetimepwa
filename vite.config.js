import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    vuetify({
      autoImport: true
    }),
    VitePWA({
      // service worker file name
      filename: 'service-worker.js',
      // registering done by vite-plugin-pwa
      registerType: 'autoUpdate',
      // service worker strategies: 'generateSW' (default) | 'injectManifest'
      strategies: 'generateSW',
      // provide manifest and SW during dev if enabled
      devOptions: {
        enabled: true // creates dev-dist folder with manifest.json and service-worker.js
      },
      // webmanifest file name
      manifestFilename: 'manifest.json',
      // content copied to /manifest.webmanifest
      manifest: {
        id: 'officetimepwa.com',
        name: 'OfficeTimePwa',
        short_name: 'OfficeTimePwa',
        description: 'OfficeTimePwa is a small time tracking app that stores all information locally.',
        lang: 'en',
        icons: [
          {
            src: './img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: './img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: './img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        start_url: './index.html',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        orientation: 'any',
        categories: [],
        prefer_related_applications: false,
        // max 5 screenshots
        screenshots: []

      }

    })
  ],
  define: {
    'process.env.DB_VERSION': JSON.stringify(packageJson.dbVersion || 1),
    // also exposed through process.env.npm_package_version
    'process.env.PACKAGE_VERSION': JSON.stringify(packageJson.version || '0')
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue'
    ]
  },
  server: {
    port: 3000
  }
})
