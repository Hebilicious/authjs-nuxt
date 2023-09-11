import GithubProvider from "@auth/core/providers/github"

const runtimeConfig = useRuntimeConfig()

export const authOptions = defineAuthJsConfig({
  secret: runtimeConfig.authJs.secret,
  theme: {
    logo: "https://nuxt.com/assets/design-kit/logo/icon-green.png"
  },
  providers: [
    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret
    })
  ]
})

export default NuxtAuthJsHandler(authOptions, runtimeConfig)
