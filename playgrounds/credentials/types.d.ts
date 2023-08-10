import { DefaultSession } from "@auth/core/types"

declare module "@auth/core/types" {
  interface Session {
    user?: User
  }
  interface User {
    role: string
  }
}

export {}
