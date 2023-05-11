import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: [
    "src/module"
  ],
  externals: [
    "@auth/core",
    "nuxt",
    "nuxt/schema",
    "vite",
    "@nuxt/kit",
    "@nuxt/schema",
    // Type only
    "vue",
    "h3",
    "vue-router",
    "unstorage",
    "nitropack",
    "unenv"
  ],
  rollup: {
    inlineDependencies: true
  }
})
