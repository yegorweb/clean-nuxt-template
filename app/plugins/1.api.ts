export default defineNuxtPlugin(() => {
  return {
    provide: {
      apiFetch: useApiFetchRaw()
    }
  }
})