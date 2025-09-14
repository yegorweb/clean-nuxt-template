export const useUser = () => {
  let $apiFetch = useApiFetchRaw()

  async function getMyName(): Promise<StoreResponse<string>> {
    let response: StoreResponse<string> = { ok: false }

    await $apiFetch<string>('/user/my-name', { method: 'GET' }).then(data => {
      response = { ok: true, data }
    }).catch((err: FetchError) => {
      response = { ok: false, status: err.status, message: err.response?._data?.message }
    })

    return response
  }

  return {
    getMyName,
  }
}