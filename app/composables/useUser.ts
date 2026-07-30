export const useUser = () => {
  const { $apiFetchSafe } = useNuxtApp()

  async function getMyName() {
    return await $apiFetchSafe<string>('/user/my-name', { 
      method: 'GET',
    })
  }

  return {
    getMyName,
  }
}