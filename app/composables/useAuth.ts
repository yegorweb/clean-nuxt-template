export const useAuth = () => ({
  ...useNuxtApp().$auth,
  user: useState<User|null|undefined>('user'),
  loggedIn: computed<boolean>(() => useState('user').value ? Object.keys(useState<User>('user').value).length > 0 : false),
	accessToken: useState<string | null| undefined>('accessToken'),
})