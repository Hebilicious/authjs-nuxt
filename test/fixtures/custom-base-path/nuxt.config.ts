export default defineNuxtConfig({
  modules: ["../../packages/authjs-nuxt/src/module.ts"],
  authJs: {
    baseUrl: "http://localhost:3000",
    basePath: "/custom/auth",
    verifyClientOnEveryRequest: true
  },
  experimental: {
    renderJsonPayloads: true
  },
  runtimeConfig: {
    authJs: { secret: "/OEjlRC2DK74ZEj5nl8qHNy+E6/JptnouIyHnANbBz0=" },
    github: {
      clientId: "",
      clientSecret: ""
    }
  }
})
