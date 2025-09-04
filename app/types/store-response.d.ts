declare global {
  type StoreResponse<T> = 
    (T extends null | undefined ? 
      { ok: true } : 
      { ok: true, data: T }) 
    | 
    { ok: false, message?: string, status?: number }
}

export { StoreResponse }