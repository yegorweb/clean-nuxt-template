export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const $apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    headers: {

    }
    onRequest({ request, options, error }) {
      if (!process.server) {

      }
    },
    onResponse ({ response }) {
      // response._data = new myBusinessResponse(response._data)
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        useState('authRedirect').value = useRoute().path
        useState('user').value = null
        navigateTo('/login')
      }
    }
  })

  return {
    provide: {
      apiFetch: $apiFetch
    }
  }
})