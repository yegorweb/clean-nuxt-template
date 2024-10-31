declare module 'nuxt/schema' {
	interface PublicRuntimeConfig {
		siteUrl: string
		apiBase: string
	}
}

declare module '#app' {
	interface NuxtApp {
	  $auth: {
			refresh: () => Promise<void>,
			logout: () => Promise<void>,
			login: (email: string, password: string) => Promise<void>,
			registration: (form: object) => Promise<void>,
		},
		$apiFetch: $Fetch<unknown, NitroFetchRequest>
	}
}
  
declare module 'vue' {
	interface ComponentCustomProperties {
	  $auth: {
			refresh: () => Promise<void>,
			logout: () => Promise<void>,
			login: (email: string, password: string) => Promise<void>,
			registration: (form: object) => Promise<void>,
		},
		$apiFetch: $Fetch<unknown, NitroFetchRequest>
	}
}

export {}