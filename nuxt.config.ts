// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/styles/main.scss'],

  devServer: {
    port: Number(process.env.NUXT_DEV_PORT || 3000)
  },
})
