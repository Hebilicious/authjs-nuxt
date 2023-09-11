import CredentialsProvider from "@auth/core/providers/credentials"

const runtimeConfig = useRuntimeConfig()

// Refer to Auth.js docs for more details
export const authOptions = defineAuthJsConfig({
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
          return { id: "1", name: "admin", email: "admin", role: "test" }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, session }) {
      // eslint-disable-next-line no-console
      console.log("jwt callback", { token, user, session })
      return token
    }
  }
})

export default NuxtAuthJsHandler(authOptions, runtimeConfig)
// If you don't want to pass the full runtime config,
//  you can pass something like this: { public: { authJs: { baseUrl: "" } } }
