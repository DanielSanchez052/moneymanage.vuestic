import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    origin: 'https://originalcoin.online',
  },
  build: {
    sourcemap: true,
    cssMinify: true,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) return id.toString().split('node_modules/')[1].split('/')[0].toString()

          // if (id.includes('node_modules')) {
          //   if (id.includes('vuestic-ui')) {
          //     return 'vuestic-ui'
          //   } else if (id.includes('medium-editor')) {
          //     return 'medium-editor'
          //   }

          //   return 'vendor' // all other package goes here
          // }
        },
      },
    },
  },
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
    }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
  },
})
