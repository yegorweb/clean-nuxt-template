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
		let response = { ok: false } as StoreResponse<null>

		await $fetch<{ user: User, accessToken: string }>('/auth/refresh', { 
			baseURL: config.public.apiBase, 
			method: 'POST', 
			credentials: 'include' 
		}).then(data => {
			user.value = data.user
			accessToken.value = data.accessToken
			response = { ok: true }
		}).catch((err: FetchError) => {
			if (err.status === 401) clearNuxtState(['user', 'accessToken'])
      response = { ok: false, status: err.status, message: err.response?._data?.message }
		})

		return response
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
		let response = { ok: false } as StoreResponse<null>

		await $fetch<{ user: User, accessToken: string }>('/auth/login', { 
			baseURL: config.public.apiBase, 
			credentials: 'include',
			method: 'POST',
			body: { email, password }
		}).then(data => {
			user.value = data.user
			accessToken.value = data.accessToken
			response = { ok: true }
		}).catch((err: FetchError) => {
      response = { ok: false, status: err.status, message: err.response?._data?.message }
		})

		return response
	}

	async function registerUser(form: object): Promise<StoreResponse<null>> {
		let response = { ok: false } as StoreResponse<null>

		await $fetch<{ user: User, accessToken: string }>('/auth/register-user', { 
			baseURL: config.public.apiBase, 
			credentials: 'include',
			method: 'POST',
			body: form
		}).then(() => {
			response = { ok: true }
		}).catch((err: FetchError) => {
      response = { ok: false, status: err.status, message: err.response?._data?.message }
		})

		return response
	}

	async function logout(): Promise<StoreResponse<null>> {
		let response = { ok: false } as StoreResponse<null>

		await $fetch('/auth/logout', { 
			baseURL: config.public.apiBase, 
			credentials: 'include',
			method: 'POST'
		}).then(async () => {
			await navigateTo('/')
			clearNuxtState(['user', 'accessToken', 'refreshed'])
		}).catch((err: FetchError) => {
      response = { ok: false, status: err.status, message: err.response?._data?.message }
		})

		return response
	}

	async function sendResetLink(email: string): Promise<StoreResponse<null>> {
		let response: StoreResponse<null> = { ok: false }
		
		await $fetch('/auth/send-reset-password-link', { 
			baseURL: config.public.apiBase, 
			method: 'POST',
			body: { email },
		}).then(() => {
      response = { ok: true }
    }).catch((err: FetchError) => {
      response = { ok: false, status: err.status, message: err.response?._data?.message }
    })

    return response
	}

	async function resetPassword(password: string, token: string, user_id: string): Promise<StoreResponse<null>> {
		let response: StoreResponse<null> = { ok: false }
		
		await $fetch('/auth/reset-password', { 
			baseURL: config.public.apiBase, 
			method: 'POST',
			body: {
				password,
				token,
				user_id
			}
		}).then(() => {
      response = { ok: true }
    }).catch((err: FetchError) => {
      response = { ok: false, status: err.status, message: err.response?._data?.message }
    })

    return response
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
