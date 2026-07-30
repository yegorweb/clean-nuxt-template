export default defineNuxtPlugin(async (nuxtApp) => {
	// Skip plugin when rendering error page
	if (nuxtApp.payload.error) {
		return {}
	}

  const config = useRuntimeConfig()

	const user = useState<User | null | undefined>('user')
	const loggedIn = computed<boolean>(() => user.value ? Object.keys(user.value).length > 0 : false)
	const accessToken = useState<string | null | undefined>('accessToken')
	const refreshed = useState<true | undefined>('refreshed')

	async function refresh(): Promise<StoreResponse<null>> {
		try {
			let data = await $fetch<{ user: User, accessToken: string }>('/auth/refresh', { 
				baseURL: config.public.apiBase, 
				method: 'POST', 
				credentials: 'include',
			})
			user.value = data.user
			accessToken.value = data.accessToken		
      return { ok: true, data: null }
  	} catch (err) {
			if (err instanceof FetchError && err.status === 401) clearNuxtState(['user', 'accessToken'])
      return { ok: false }
		}
	}
	
	if (!refreshed.value) {
		await refresh()
		refreshed.value = true
	}

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
				return navigateTo({ path: '/auth/login', query: { redirect: encodeURIComponent(to.path) } })
			}
		},
		{ global: true }
	)

	async function login(email: string, password: string): Promise<StoreResponse<null>> {
		try {
			let data = await $fetch<{ user: User, accessToken: string }>('/auth/login', { 
				baseURL: config.public.apiBase, 
				credentials: 'include',
				method: 'POST',
				body: { email, password },
			})
			user.value = data.user
			accessToken.value = data.accessToken		
      return { ok: true, data: null }
  	} catch (err) {
      return handleApiError(err as FetchError)
    }
	}

	async function registerUser(form: object): Promise<StoreResponse<null>> {
		try {
			await $fetch('/auth/register-user', { 
				baseURL: config.public.apiBase, 
				credentials: 'include',
				method: 'POST',
				body: form,
			})
      return { ok: true, data: null }
  	} catch (err) {
      return handleApiError(err as FetchError)
    }
	}

	async function logout(): Promise<StoreResponse<null>> {
		try {
			await $fetch('/auth/logout', { 
				baseURL: config.public.apiBase, 
				credentials: 'include',
				method: 'POST',
			})
			await navigateTo('/')
			clearNuxtState(['user', 'accessToken', 'refreshed'])
      return { ok: true, data: null }
  	} catch (err) {
      return handleApiError(err as FetchError)
    }
	}

	async function sendResetLink(email: string): Promise<StoreResponse<null>> {
		try {		
			await $fetch('/auth/send-reset-password-link', { 
				baseURL: config.public.apiBase, 
				method: 'POST',
				body: { email },
			})
      return { ok: true, data: null }
  	} catch (err) {
      return handleApiError(err as FetchError)
    }
	}

	async function resetPassword(password: string, token: string, user_id: string): Promise<StoreResponse<null>> {
		try {
			await $fetch('/auth/reset-password', { 
				baseURL: config.public.apiBase, 
				method: 'POST',
				body: {
					password,
					token,
					user_id,
				},
			})
      return { ok: true, data: null }
  	} catch (err) {
      return handleApiError(err as FetchError)
    }
	}

	return {
		provide: {
			auth: {
				refresh,
				login,
				registerUser,
				logout,
				sendResetLink,
				resetPassword,
			},
		},
	}
})
