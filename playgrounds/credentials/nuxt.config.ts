// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@hebilicious/authjs-nuxt"],
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
    github: {
      clientId: "",
      clientSecret: ""
    },
    public: {
      authJs: {
        serverUrl: "http://localhost:3000",
        verifyClientOnEveryRequest: true
      }
    }
  }
})
