import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((nuxtApp) => {
	const vuetify = createVuetify({
		defaults: {
			VBtn: {
				class: 'text-body-2'
			},
			global: {
				ripple: false,
			},
		}
	})

	nuxtApp.vueApp.use(vuetify)
})
