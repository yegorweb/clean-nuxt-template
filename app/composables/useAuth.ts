type UseAuthOptions<T extends boolean = false> = {
  required?: T
}

export const useAuth = <T extends boolean = false>(
  options?: UseAuthOptions<T>,
) => {
  const $auth = useNuxtApp().$auth
  const user = useState<T extends true ? User : User | null | undefined>('user')
  const loggedIn = computed<boolean>(() => user.value ? Object.keys(user.value).length > 0 : false)
	const accessToken = useState<T extends true ? string : string | null | undefined>('accessToken')

  return {
    ...$auth,
    user,
    loggedIn,
    accessToken,
  }
}