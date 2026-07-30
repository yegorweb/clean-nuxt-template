import { appendResponseHeader, H3Event } from 'h3'
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

async function fetchWithCookies<
	DefaultT = unknown,
	DefaultR extends NitroFetchRequest = NitroFetchRequest,
	T = DefaultT,
	R extends NitroFetchRequest = DefaultR,
	O extends NitroFetchOptions<R> = NitroFetchOptions<R>
>(event: H3Event, url: R, options?: O) {
	const headers = useRequestHeaders(['cookie'])
  const res = await $fetch.raw<T>(url, { 
		...options,
		headers: {...options?.headers, ...headers},
		credentials: 'include', 
		ignoreResponseError: true,
	})
  const cookies = res.headers.getSetCookie()
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

	const config = useRuntimeConfig()
	const event = useRequestEvent()
	
	const user = useState<User | null | undefined>('user')
	const loggedIn = computed<boolean>(() => user.value ? Object.keys(user.value).length > 0 : false)
	const accessToken = useState<string | null| undefined>('accessToken')
  const tokenCookie = useCookie('refreshToken')
	const refreshed = useState<true | undefined>('refreshed')

	async function refresh(): Promise<StoreResponse<null>> {
		try {
      if (tokenCookie.value) {
        const res_data = await fetchWithCookies<{
          user: User, 
          accessToken: string,
        }>(event!, '/auth/refresh', {
					baseURL: config.public.apiBase,
					method: 'POST',
				})
        user.value = res_data?.user
        accessToken.value = res_data?.accessToken
			  refreshed.value = true
      }
			return { ok: true, data: null }
		} catch {
			return { ok: false }
		}
	}
	await refresh()

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

	return {
		provide: {
			auth: {
				refresh,
			},
		},
	}
})
