import path from "node:path"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "../packages/authjs-nuxt/src/module"
  ],
  alias: {
    "jose": path.resolve(__dirname, "node_modules/jose/dist/browser/index.js"),
    "@panva/hkdf": path.resolve(__dirname, "node_modules/@panva/hkdf/dist/web/index.js")
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
      clientId: "clientId",
      clientSecret: "clientSecret"
    },
    public: {
      authJs: {
        baseUrl: "http://localhost:3000",
        verifyClientOnEveryRequest: true
      }
    }
  }
})
