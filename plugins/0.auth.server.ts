import type { User } from "~/types/user"
import { appendResponseHeader, H3Event } from 'h3'

export const fetchWithCookie = async (event: H3Event, url: string) => {
	const headers = useRequestHeaders(['cookie'])
  const res = await $fetch.raw(url, { headers })
  const cookies = res.headers.getSetCookie()
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
	let accessToken = useState<string | null| undefined>('accessToken')

	async function refresh(): Promise<void> {
		try {
			let res_data = await fetchWithCookie(event!, useRuntimeConfig().public.apiBase + '/auth/refresh')
			user.value = res_data.user ?? null
			accessToken.value = res_data.accessToken ?? null
		} catch {}
	}
	await refresh()
  useState('refreshed').value = true

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
				return navigateTo({ path: '/login', query: { redirect: to.path } })
			}
		},
		{ global: true }
	)

	return {}
})
