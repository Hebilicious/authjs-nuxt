// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "../packages/authjs-nuxt/src/module.ts"
    // "@hebilicious/authjs-nuxt"
  ],
  authJs: {
    guestRedirectTo: "/redirected"
  },
  nitro: {
    routeRules: {
      "/": { ssr: true, prerender: true },
      "/private": { ssr: true, prerender: true }
    }
  },
  devtools: {
    enabled: true
  },
  experimental: {
    renderJsonPayloads: true
  },
  runtimeConfig: {
    authJs: { secret: "/OEjlRC2DK74ZEj5nl8qHNy+E6/JptnouIyHnANbBz0=" },
    keycloak: {
      clientId: process.env.NUXT_KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.NUXT_KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.NUXT_KEYCLOAK_ISSUER
    },
    public: {
      authJs: {
        baseUrl: "http://localhost:3000",
        verifyClientOnEveryRequest: true
      }
    }
  }
})
