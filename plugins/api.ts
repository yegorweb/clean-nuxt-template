export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const $apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options, error }) {
      
    },
    onResponse ({ response }) {
      // response._data = new myBusinessResponse(response._data)
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        useState('authRedirect').value = useRoute().path
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