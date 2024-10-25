import type { User } from "~/types/user"
import { appendResponseHeader, H3Event } from 'h3'

export const fetchWithCookie = async (event: H3Event, url: string): Promise<any> => {
  const res = await $fetch.raw(url, { credentials: "include" })

  const cookies = (res.headers.get('set-cookie') || '').split(',')
  for (const cookie of cookies) {
    appendResponseHeader(event, 'set-cookie', cookie)
  }
  return res._data as any
}

export default defineNuxtPlugin(async (nuxtApp) => {
	// Skip plugin when rendering error page
	if (nuxtApp.payload.error) {
		return {}
	}

	let event = useRequestEvent()

	let user = useState<User | null | undefined>('user')

	async function refresh(): Promise<void> {
		try {
			user.value = await fetchWithCookie(event!, useRuntimeConfig().public.apiBase + '/auth/refresh')
		} catch {}
	}
	await refresh()

	let loggedIn = computed<boolean>(() => !!user.value?.email)

	let redirectTo = useState('authRedirect')

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

	async function login(email: string, password: string) {
		let { data } = await useApiFetch<User | null | undefined>('/auth/login', { method: "POST", body: { email, password }, credentials: "include" })
		user.value = data.value
		redirectTo.value = null
	}

	async function registration(form: object) {
		let { data } = await useApiFetch<User | null | undefined>('/auth/registration', { method: "POST", body: form, credentials: "include" })
		user.value = data.value
	}

	async function logout() {
		let { error } = await useApiFetch('/auth/logout', { method: "POST", credentials: "include" })
		if (!error.value)
			user.value = null
	}	

	return {
		provide: {
			auth: {
				user,
				loggedIn,
				refresh,
				redirectTo,
				login,
				registration,
				logout
			},
		},
	}
})
