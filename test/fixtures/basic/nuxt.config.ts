export default defineNuxtConfig({
  modules: ["@hebilicious/authjs-nuxt"],
  authJs: {
    baseUrl: "http://localhost:3000",
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
