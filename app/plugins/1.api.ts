import { appendResponseHeader } from 'h3'
import type { H3Event } from 'h3'
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

export default defineNuxtPlugin(nuxtApp => {
	// Skip plugin when rendering error page
	if (nuxtApp.payload.error) {
		return {}
	}

  const auth = useAuth()
  const config = useRuntimeConfig()

  const redirectToLogin = () => navigateTo({ path: '/auth/login', query: { redirect: encodeURIComponent(useRoute().path) } })

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    retry: 1,
    retryStatusCodes: [408, 409, 425, 500, 502, 503, 504, 401],

    onRequest({ options }) {
      if (auth.accessToken.value) {
        if (!(options.headers instanceof Headers)) {
          options.headers = new Headers(options.headers)
        }
        options.headers.set('Authorization', `Bearer ${auth.accessToken.value}`)
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401 && response._data?.tokenNeedRefresh) {
        await auth.refresh()
        if (!auth.accessToken.value) {
          await redirectToLogin()
        }
      } else if (response.status === 401) {
        await redirectToLogin()
      }
    },
  })

  const fetchSafe = async <
    DefaultT = unknown,
    DefaultR extends NitroFetchRequest = NitroFetchRequest,
    T = DefaultT,
    R extends NitroFetchRequest = DefaultR,
    O extends NitroFetchOptions<R> = NitroFetchOptions<R>
  >(
    url: R,
    options?: O
  ): Promise<StoreResponse<T>> => {
    try {  
      const data = await $fetch<T>(url, options)
      return { ok: true, data } as StoreResponse<T>
    } catch (err) {
      return handleApiError(err as FetchError)
    }
  }

  const apiFetchSafe = async <
    DefaultT = unknown,
    DefaultR extends NitroFetchRequest = NitroFetchRequest,
    T = DefaultT,
    R extends NitroFetchRequest = DefaultR,
    O extends NitroFetchOptions<R> = NitroFetchOptions<R>
  >(
    url: R,
    options?: O
  ): Promise<StoreResponse<T>> => {
    try {  
      const data = await apiFetch<T>(url, options)
      return { ok: true, data } as StoreResponse<T>
    } catch (err) {
      return handleApiError(err as FetchError)
    }
  }

  const fetchSafeWithCookies = async <
    DefaultT = unknown,
    DefaultR extends NitroFetchRequest = NitroFetchRequest,
    T = DefaultT,
    R extends NitroFetchRequest = DefaultR,
    O extends NitroFetchOptions<R> = NitroFetchOptions<R>
  >(
    event: H3Event | undefined,
    url: R,
    options?: O
  ): Promise<StoreResponse<T>> => {
    const headers = useRequestHeaders(['cookie'])
    try {
      const res = await $fetch.raw<T>(url, { 
        ...options,
        headers: {...options?.headers, ...headers},
        credentials: 'include',
        ignoreResponseError: true, 
      })
      if (event) {
        const cookies = res.headers.getSetCookie()
        for (const cookie of cookies) {
          appendResponseHeader(event, 'set-cookie', cookie)
        }
      }
      return res.status < 400 ? 
        { ok: true, data: res._data as any } :
        {
          ok: false,
          status: res.status,
          message: (res._data as any)?.message,
        }
    } catch {
      return { ok: false } 
    }
  }

  const apiFetchSafeWithCookies = async <
    DefaultT = unknown,
    DefaultR extends NitroFetchRequest = NitroFetchRequest,
    T = DefaultT,
    R extends NitroFetchRequest = DefaultR,
    O extends NitroFetchOptions<R> = NitroFetchOptions<R>
  >(
    event: H3Event | undefined,
    url: R,
    options?: O
  ): Promise<StoreResponse<T>> => {
    const headers = useRequestHeaders(['cookie'])
    try {
      const res = await apiFetch.raw<T>(url, { 
        ...options,
        headers: {...options?.headers, ...headers},
        credentials: 'include',
        ignoreResponseError: true, 
      })
      if (event) {
        const cookies = res.headers.getSetCookie()
        for (const cookie of cookies) {
          appendResponseHeader(event, 'set-cookie', cookie)
        }
      }
      return res.status < 400 ? 
        { ok: true, data: res._data as T } :
        {
          ok: false,
          status: res.status,
          message: (res._data as any)?.message,
        }
    } catch {
      return { ok: false } 
    }
  }

  return {
    provide: {
      apiFetch,
      fetchSafe,
      apiFetchSafe,
      fetchSafeWithCookies,
      apiFetchSafeWithCookies,
    }
  }
})