import { appendResponseHeader, H3Event } from 'h3'

async function fetchWithCookie<T>(event: H3Event, url: string) {
	const headers = useRequestHeaders(['cookie'])
  const res = await $fetch.raw<T>(url, { method: 'POST', credentials: 'include', headers })
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

	let config = useRuntimeConfig()
	let event = useRequestEvent()
  let tokenCookie = useCookie('refreshToken')

	let user = useState<User | null | undefined>('user')
	let accessToken = useState<string | null| undefined>('accessToken')

	async function refresh() {
		try {
      if (tokenCookie.value) {
        let res_data = await fetchWithCookie<{
          user: User, 
          accessToken: string
        }>(event!, config.public.apiBase + '/auth/refresh')
        user.value = res_data?.user
        accessToken.value = res_data?.accessToken
      }
		} catch {}
	}
	await refresh()
  useState('refreshed').value = true

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

	return {}
})
