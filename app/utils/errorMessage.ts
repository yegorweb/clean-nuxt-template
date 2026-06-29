export const generateErrorMessage = (error: Extract<StoreResponse<any>, { ok: false }>, { prefix='Ошибка', addStatus=true }: { prefix?: string, addStatus?: boolean } = { prefix: 'Ошибка', addStatus: true }) => {
  let res = prefix
  if (error.status) {
    if (addStatus) res += ` ${error.status}`
    if (error.message) res += `: ${error.message}`
  }
  else {
    res = 'Ошибка сети'
  }
  return res
}
