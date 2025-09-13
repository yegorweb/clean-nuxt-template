// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/robots', '@nuxtjs/sitemap', 'vuetify-nuxt-module', 'nuxt-svgo'],

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

  robots: {
    groups: [
      { 
        userAgent: '*', 
        allow: '/'
      },
    ]
  },

  features: {
    inlineStyles: false
  },

  vuetify: {
    vuetifyOptions: './vuetify.config.ts',
  },

  svgo: {
    defaultImport: 'skipsvgo',
  },

  devServer: {
    port: Number(import.meta.env.NUXT_DEV_PORT || 3000)
  },

  imports: {
    imports: [
      {
        from: 'ofetch',
        name: 'FetchError',
        declarationType: 'class',
        type: true
      },
      {
        from: 'ofetch',
        name: 'FetchError',
        declarationType: 'class',
      },
    ],
    presets: [
      {
        from: 'vee-validate',
        imports: ['useForm', 'useField'],
      },
    ],
  }
})