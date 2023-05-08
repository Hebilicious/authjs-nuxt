export default defineAppConfig({
  // @ts-expect-error: bug with docus types
  docus: {
    title: "AutJS Nuxt",
    description: "Unleash Nuxt Auth.",
    image: "https://repository-images.githubusercontent.com/420050565/6459bd6d-fd45-4bce-918a-9c5fa62a0576",
    socials: {
      twitter: "nuxt_js",
      github: "hebilicious/authjs-nuxt"
    },
    github: {
      owner: "hebilicious",
      repo: "authjs-nuxt",
      branch: "main",
      dir: "docs/content",
      edit: true
    },
    aside: {
      level: 0,
      exclude: []
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: []
    },
    footer: {
      iconLinks: [
        {
          href: "https://nuxt.com",
          icon: "IconNuxtLabs"
        }
      ]
    }
  }
})
