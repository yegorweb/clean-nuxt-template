// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/styles/main.scss'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      link: [
        { rel: 'icon', href: '/favicon.ico' },
      ]
    }
  },

  devServer: {
    port: Number(process.env.NUXT_DEV_PORT || 3000)
  },
})
