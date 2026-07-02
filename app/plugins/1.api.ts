export default defineNuxtPlugin((nuxtApp) => {
	// Skip plugin when rendering error page
	if (nuxtApp.payload.error) {
		return {}
	}

  return {
    provide: {
      apiFetch: useApiFetchRaw()
    }
  }
})