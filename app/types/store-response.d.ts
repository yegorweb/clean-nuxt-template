declare global {
  type StoreResponse<T> = 
    { ok: true; data: T } | 
    { ok: false, message?: string, status?: number }
}

export { StoreResponse }