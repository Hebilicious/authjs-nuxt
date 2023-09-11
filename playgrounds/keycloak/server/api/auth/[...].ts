import Keycloak from "@auth/core/providers/keycloak"

const runtimeConfig = useRuntimeConfig()

export const authOptions = defineAuthJsConfig({
  secret: runtimeConfig.authJs.secret,
  theme: {
    logo: "https://nuxt.com/assets/design-kit/logo/icon-green.png"
  },
  providers: [
    Keycloak({
      clientId: runtimeConfig.keycloak.clientId,
      clientSecret: runtimeConfig.keycloak.clientSecret,
      issuer: runtimeConfig.keycloak.issuer
    })
  ]
})

export default NuxtAuthJsHandler(authOptions, runtimeConfig)
