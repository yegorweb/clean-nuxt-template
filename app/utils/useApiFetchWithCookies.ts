import { appendResponseHeader } from 'h3'
import type { H3Event } from 'h3'
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

export const useApiFetchWithCookies = async <
  DefaultT = unknown,
  DefaultR extends NitroFetchRequest = NitroFetchRequest,
  T = DefaultT,
  R extends NitroFetchRequest = DefaultR,
  O extends NitroFetchOptions<R> = NitroFetchOptions<R>
>(
  event: H3Event,
  url: R,
  options?: O
) => {
  const $apiFetch = useNuxtApp().$apiFetch
  const headers = useRequestHeaders(['cookie'])
  if (options && !options.credentials) options.credentials = 'include'
  const res = await $apiFetch.raw<T>(url, options ? Object.assign(options, { headers: {...options.headers, ...headers} }) : { headers, credentials: 'include' })
  const cookies = res.headers.getSetCookie()
  for (const cookie of cookies) {
    appendResponseHeader(event, 'set-cookie', cookie)
  }
  return res._data
}
