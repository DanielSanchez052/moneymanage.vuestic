import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    origin: 'https://moneymanage.my',
    headers: {
      'Strict-Transport-Security': 'max-age=2592000; includeSubDomains', // Adds HSTS options to your website, with a expiry time of 1 day
      'X-Content-Type-Options': 'nosniff', // Protects from improper scripts runnings
      'X-Frame-Options': 'DENY', // Stops your site being used as an iframe
      'X-XSS-Protection': '1; mode=block', // Gives XSS protection to legacy browsers
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy':
        'accelerometer=(), autoplay=(), camera=(), encrypted-media=(), microphone=(), geolocation=(), gyroscope=(), magnetometer=(), midi=(), payment=(), picture-in-picture=(), sync-xhr=(self), usb=()',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com ; img-src 'self'; frame-src 'self'; connect-src 'self' https://dev-moneymanage-identity.moneymanage.my https://dev-moneymanage.moneymanage.my wss://dev-moneymanage.moneymanage.my",
    },
  },
  //https://fonts.googleapis.com https://mnw9y2xpf0.execute-api.us-east-1.amazonaws.com https://dev-moneymanage.originalcoin.online
  build: {
    sourcemap: true,
    cssMinify: true,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // if (id.includes('node_modules')) return id.toString().split('node_modules/')[1].split('/')[0].toString()

          if (id.includes('node_modules')) {
            if (id.includes('vuestic-ui')) {
              return 'vuestic-ui'
            } else if (id.includes('medium-editor')) {
              return 'medium-editor'
            }

            return 'vendor' // all other package goes here
          }
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
