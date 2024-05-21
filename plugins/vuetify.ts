import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((nuxtApp) => {
	const vuetify = createVuetify({
		defaults: {
			VBtn: {
				style: 'text-transform: none;',
			},
			global: {
				ripple: false,
			},
		}
	})

	nuxtApp.vueApp.use(vuetify)
})
