import type { User } from "~/types/user"
import { appendResponseHeader, H3Event } from 'h3'

export const fetchWithCookie = async (event: H3Event, url: string) => {
  const res = await $fetch.raw(url)
  const cookies = (res.headers.get('set-cookie') || '').split(',')
  for (const cookie of cookies) {
    appendResponseHeader(event, 'set-cookie', cookie)
  }
  return res._data
}

export default defineNuxtPlugin(async (nuxtApp) => {
	// Skip plugin when rendering error page
	if (nuxtApp.payload.error) {
		return {}
	}

	const event = useRequestEvent()
	const { refresh } =  await useAsyncData(() => fetchWithCookie(event!, useRuntimeConfig().public.apiBase + '/auth/refresh'))

	const token = useCookie('token')
	const user = useCookie<User | null | undefined>('user')
	const loggedIn = computed<boolean>(() => !!user.value?.email)

	// Create a ref to know where to redirect the user when logged in
	const redirectTo = useState('authRedirect')

	/**
		* Add global route middleware to protect pages using:
		* 
		* definePageMeta({
		*  auth: true
		* })
		*/
	// 

	addRouteMiddleware(
		'auth',
		(to) => {
			if (to.meta.auth && !loggedIn.value) {
				redirectTo.value = to.path
				return '/login'
			}
		},
		{ global: true }
	)

	const currentRoute = useRoute()

	if (process.client) {
		watch(loggedIn, async (loggedIn) => {
			if (!loggedIn && currentRoute.meta.auth) {
				redirectTo.value = currentRoute.path
				await navigateTo('/login')
			}
		})
	}

	if (loggedIn.value && currentRoute.path === '/login') {
		await navigateTo(redirectTo.value || '/')
	}

	return {
		provide: {
			auth: {
				loggedIn,
				refresh,
				redirectTo,
				updateSession,
			},
		},
	}
})
