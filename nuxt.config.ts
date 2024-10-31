import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  css: ['~/assets/styles/main.scss'],
  devtools: { enabled: false },
  build: {
    transpile: ['vuetify'],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
    },
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    ['@nuxtjs/google-fonts', {
      families: {
        Montserrat: [100, 200, 300, 400, 500, 600, 700, 800, 900]
      },
      preload: true,
      download: true,
      preconnect: true
    }],
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  devServer: {
    port: Number(process.env.NUXT_DEV_PORT || 3000)
  }
})
