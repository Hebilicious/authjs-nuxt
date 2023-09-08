import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "AuthJS Nuxt",
  description: "An edge-compatible module for AuthJS",
  head: [
    ["link", { rel: "icon", href: "favicon.ico" }]
  ],
  themeConfig: {
    logo: "/favicon.ico",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Get Started", link: "/getting-started" }
    ],

    sidebar: [
      {
        // text: 'AuthJS',
        items: [
          { text: "Get Started", link: "/getting-started" },
          { text: "Nuxt Configuration", link: "/nuxt-configuration" },
          { text: "Usage", link: "/usage" }
        ]
      }
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/Hebilicious/authjs-nuxt" }
    ]
  }
})
