type UseAuthOptions<T extends boolean = false> = {
  required?: T
}

export const useAuth = <T extends boolean = false>(
  options?: UseAuthOptions<T>,
) => ({
  ...useNuxtApp().$auth,
  user: useState<T extends true ? User : User | null | undefined>('user'),
  loggedIn: computed<boolean>(() => useState('user').value ? Object.keys(useState<User>('user').value).length > 0 : false),
	accessToken: useState<T extends true ? string : string | null | undefined>('accessToken'),
})