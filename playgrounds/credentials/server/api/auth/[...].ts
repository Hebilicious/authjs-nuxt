import CredentialsProvider from "@auth/core/providers/credentials"
import type { AuthConfig } from "@auth/core/types"

import { NuxtAuthHandler } from "#auth"

// The #auth virtual import comes from this module. You can use it on the client
// and server side, however not every export is universal. For example do not
// use sign-in and sign-out on the server side.

const runtimeConfig = useRuntimeConfig()

// Refer to Auth.js docs for more details

export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials.username === "admin"
          && credentials.password === "admin"
        )
          return { id: "1", name: "admin", email: "admin" }

        return null
      }
    })
  ]
}

export default NuxtAuthHandler(authOptions, runtimeConfig)
// If you don't want to pass the full runtime config,
//  you can pass something like this: { public: { authJs: { baseUrl: "" } } }
