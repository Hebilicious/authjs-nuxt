import Keycloak from "@auth/core/providers/keycloak"
import type { AuthConfig } from "@auth/core/types"
import { NuxtAuthHandler } from "#auth"

const runtimeConfig = useRuntimeConfig()

export const authOptions: AuthConfig = {
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
}

export default NuxtAuthHandler(authOptions, runtimeConfig)
