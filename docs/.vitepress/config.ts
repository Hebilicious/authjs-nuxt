import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "AuthJS Nuxt",
  description: "An edge-compatible module for AuthJS",
  head: [
    ["link", { rel: "icon", href: "favicon.svg" }]
  ],
  themeConfig: {
    logo: "/favicon.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Get Started", link: "/getting-started" }
    ],

    sidebar: [
      {
        // text: 'AuthJS',
        items: [
          { text: "Get Started", link: "/getting-started" }
        ]
      }
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/Hebilicious/authjs-nuxt" }
    ]
  }
})
