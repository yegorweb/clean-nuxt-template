export const useUser = () => {
  const $apiFetch = useApiFetchRaw()

  return {
    async changeUser(user: Partial<User>) {
      return await $apiFetch('/user/change-user', {
        method: 'POST',
        body: {
          user
        }
      })
    },
    async changeMe(user: Partial<User>) {
      let auth = useAuth()
      user._id = auth.user.value?._id
      await useUser().changeUser(user)
      await auth.refresh()
    }
  }
}