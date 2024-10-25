import type { CookieRef } from "#app"
import type { User } from "./types/user"

declare module 'nuxt/schema' {
	interface PublicRuntimeConfig {
		siteUrl: string
		apiBase: string
	}
}

declare module '#app' {
	interface NuxtApp {
	  $auth: {
			user: globalThis.Ref<User | null | undefined>,
			loggedIn: globalThis.ComputedRef<boolean>,
			refresh: () => Promise<void>,
			redirectTo: globalThis.Ref<unknown>,
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
			user: globalThis.Ref<User | null | undefined>,
			loggedIn: globalThis.ComputedRef<boolean>,
			refresh: () => Promise<void>,
			redirectTo: globalThis.Ref<unknown>,
			logout: () => Promise<void>,
			login: (email: string, password: string) => Promise<void>,
			registration: (form: object) => Promise<void>,
		},
		$apiFetch: $Fetch<unknown, NitroFetchRequest>
	}
}

export {}