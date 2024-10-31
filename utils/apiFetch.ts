export const useApiFetchRaw = () => $fetch.create({
  baseURL: useRuntimeConfig().public.apiBase,
  credentials: 'include',

  onRequest({ options }) {
    options.retryStatusCodes = options.retryStatusCodes?.filter(item => item !== 401)

    const headers = useRequestHeaders(['cookie'])
    if (process.server) {
      options.headers = {
        ...options.headers, 
        ...headers
      }
    }

    let accessToken = useState('accessToken')
    if (accessToken.value) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken.value}`
      }
    }
  },
  async onResponseError({ request, response, options }) {
    if (response.status === 401) {
      await useAuth().refresh()
      
      let accessToken = useState('accessToken')

      if (accessToken.value) {
        options.retryStatusCodes?.push(401)
      } else {
        useState('authRedirect').value = useRoute().path
        navigateTo('/login')
      }
    }
  }
})