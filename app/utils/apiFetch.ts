export const useApiFetchRaw = () => $fetch.create({
  baseURL: useRuntimeConfig().public.apiBase,
  credentials: 'include',
  retry: 1,
  retryStatusCodes: [408, 409, 425, 500, 502, 503, 504, 401],

  onRequest({ options }) {
    let auth = useAuth()
    if (auth.accessToken.value) {
      options.headers.set('Authorization', `Bearer ${auth.accessToken.value}`)
    }
  },
  async onResponseError({ response }) {
    if (response.status === 401 && response._data?.tokenNeedRefresh) {
      let auth = useAuth()
      await auth.refresh()
      if (!auth.accessToken.value) {
			  navigateTo({ path: '/auth/login', query: { redirect: encodeURIComponent(useRoute().path) } })
      }
    } else if (response.status === 401) {
			navigateTo({ path: '/auth/login', query: { redirect: encodeURIComponent(useRoute().path) } })
    }
  },
})