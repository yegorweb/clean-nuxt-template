import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'
import { ru } from 'vuetify/locale'

export default defineVuetifyConfiguration({
  locale: {
    locale: 'ru',
    fallback: 'en',
    messages: { ru }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#27384b',
          accent: '#e76f51'
        },
      }
    }
  },
  defaults: {
    VBtn: {
      class: 'text-body-2',
      style: 'border-radius: 8px;'
    },
    VCheckboxBtn: {
      style: 'gap: 4px;'
    },
    global: {
      ripple: false,
      elevation: 0,
    },
  },
  icons: {
    defaultSet: 'mdi-svg',
  },
  labComponents: [],
})