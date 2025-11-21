export default defineNuxtPlugin(async (nuxtApp) => {
	// Skip plugin when rendering error page
	if (nuxtApp.payload.error) {
		return {}
	}

  const config = useRuntimeConfig()

	let user = useState<User | null | undefined>('user')
	let accessToken = useState<string | null | undefined>('accessToken')
	let refreshed = useState<true | undefined>('refreshed')

	async function refresh(): Promise<StoreResponse<null>> {
		try {
			let res = await $fetch.raw<{ 
        user: User, 
        accessToken: string 
      } | null | undefined>(
        '/auth/refresh', { 
					baseURL: config.public.apiBase, 
					method: 'POST', 
					credentials: 'include' 
			})
			if (res._data) {
				user.value = res._data.user
				accessToken.value = res._data.accessToken
			}
      return { ok: res.ok }
		} catch (err) {
			if ((err as FetchError).status === 401) {
				user.value = null
				accessToken.value = null
				clearNuxtState(['user', 'accessToken'])
			}
      return { 
        ok: false, 
        status: (err as FetchError).status,
        message: (err as FetchError).response?._data?.message
      }
		}
	}
	if (!refreshed.value) {
		await refresh()
		refreshed.value = true
	}

	let loggedIn = computed<boolean>(() => user.value ? Object.keys(user.value).length > 0 : false)

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
			let res = await $fetch.raw<{ user: User, accessToken: string } | null | undefined>('/auth/login', { 
				baseURL: config.public.apiBase, 
				credentials: 'include',
				method: 'POST',
				body: { email, password }
			})
	
			if (res.ok && res._data) {
				user.value = res._data.user
				accessToken.value = res._data.accessToken
        return { ok: true }
			}
      return { ok: false }
		} catch (err) {
      return err instanceof FetchError ? 
        { 
          ok: false, 
          status: err.status,
          message: err.response?._data?.message
        } : { ok: false }
		}
	}

	async function registerUser(form: object): Promise<StoreResponse<null>> {
		try {
			let res = await $fetch.raw<{ user: User, accessToken: string } | null | undefined>('/auth/register-user', { 
				baseURL: config.public.apiBase, 
				credentials: 'include',
				method: 'POST',
				body: form
			})
			
			return { ok: res.ok }
		} catch (err) {
			return { 
				ok: false, 
				status: (err as FetchError).status,
				message: (err as FetchError).response?._data?.message
			}
		}
	}

	async function logout(): Promise<StoreResponse<null>> {
		try {
			let res = await $fetch.raw('/auth/logout', { 
				baseURL: config.public.apiBase, 
				credentials: 'include',
				method: 'POST'
			})
			
			if (res.ok) {
				user.value = null
				accessToken.value = null
				clearNuxtState(['user', 'accessToken', 'refreshed'])
			}
			return { ok: res.ok }
		} catch (err) {
			return err instanceof FetchError ? 
        { 
          ok: false, 
          status: err.status,
          message: err.response?._data?.message
        } : { ok: false }
		}
	}

	let $apiFetch = useApiFetchRaw()

	async function sendResetLink(email: string): Promise<StoreResponse<null>> {
		let response: StoreResponse<null> = { ok: false }
		
		await $apiFetch<string>(
			'/auth/send-reset-password-link', 
			{ 
				method: 'POST',
				body: { email },
			}
		).then(() => {
      response = { ok: true }
    }).catch((err: FetchError) => {
      response = { ok: false, status: err.status, message: err.response?._data?.message }
    })

    return response
	}

	async function resetPassword(password: string, token: string, user_id: string): Promise<StoreResponse<null>> {
		let response: StoreResponse<null> = { ok: false }
		
		await $apiFetch<string>(
			'/auth/reset-password', 
			{ 
				method: 'POST',
				body: {
					password,
					token,
					user_id
				}
			}
		).then(() => {
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
