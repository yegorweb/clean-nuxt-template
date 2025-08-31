// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/robots', '@nuxtjs/sitemap', 'vuetify-nuxt-module'],

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

  site: { 
    url: 'http://site.com', 
    name: 'Сайт' 
  }, 

  robots: {
    groups: [
      { 
        userAgent: '*', 
        allow: '/'
      },
    ]
  },

  devServer: {
    port: Number(import.meta.env.NUXT_DEV_PORT || 3000)
  },
})