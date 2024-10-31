import type { User } from "~/types/user"

export default defineNuxtPlugin(async (nuxtApp) => {
	// Skip plugin when rendering error page
	if (nuxtApp.payload.error) {
		return {}
	}

  const config = useRuntimeConfig()

	let user = useState<User | null | undefined>('user')
	let accessToken = useState<string | null| undefined>('accessToken')
	let refreshed = useState<true | undefined>('refreshed')

	async function refresh(): Promise<void> {
		try {
			let res = await $fetch.raw<{ user: User, accessToken: string } | null | undefined>('/auth/refresh', { baseURL: config.public.apiBase, credentials: 'include' })
			if (res._data) {
				user.value = res._data.user
				accessToken.value = res._data.accessToken
			} else if (res.status === 401) {
				user.value = null
				accessToken.value = null
				clearNuxtState(['user', 'accessToken'])
			}
		} catch {}
	}
	if (!refreshed.value) {
		await refresh()
		refreshed.value = true
	}

	let loggedIn = computed<boolean>(() => user.value ? Object.keys(user.value).length > 0 : false)

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
				return navigateTo('/login')
			}
		},
		{ global: true }
	)

	async function login(email: string, password: string) {
		let res = await $fetch.raw<{ user: User, accessToken: string } | null | undefined>('/auth/login', { 
			baseURL: config.public.apiBase, 
			credentials: 'include',
			method: 'POST',
			body: { email, password }
		})

		if (res.ok && res._data) {
			user.value = res._data.user
			accessToken.value = res._data.accessToken
			await navigateTo(useState('authRedirect').value || '/', { replace: true })
			redirectTo.value = null
			clearNuxtState('authRedirect')
		}
	}

	async function registration(form: object) {
		let res = await $fetch.raw<{ user: User, accessToken: string } | null | undefined>('/auth/registration', { 
			baseURL: config.public.apiBase, 
			credentials: 'include',
			method: 'POST',
			body: form
		})
		
		if (res.ok && res._data) {
			user.value = res._data.user
			accessToken.value = res._data.accessToken
			navigateTo(`/user/${user.value._id}`, { replace: true })
			redirectTo.value = null
			clearNuxtState('authRedirect')
		}
	}

	async function logout() {
		let res = await $fetch.raw('/auth/logout', { 
			baseURL: config.public.apiBase, 
			credentials: 'include',
			method: 'POST'
		})
		
		if (res.ok) {
			user.value = null
			accessToken.value = null
			redirectTo.value = null
			clearNuxtState(['user', 'accessToken', 'authRedirect', 'refreshed'])
			navigateTo('/')
			// let route = useRoute()
			// redirectTo.value = route.path
			// navigateTo('/login')
		}
	}

	return {
		provide: {
			auth: {
				refresh,
				login,
				registration,
				logout,
			},
		},
	}
})
