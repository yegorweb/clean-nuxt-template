declare global {
  interface User {
    _id: string
    name: string
    email: string
    roles: string[]
  }
}

export { User }