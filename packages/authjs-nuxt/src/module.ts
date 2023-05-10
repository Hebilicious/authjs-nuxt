import { addImports, addPlugin, addTemplate, createResolver, defineNuxtModule, useLogger } from "@nuxt/kit"
import { defu } from "defu"
import { configKey } from "./runtime/utils"

const NAME = "@auth/nuxt"

export default defineNuxtModule({
  meta: {
    name: NAME,
    configKey
  },
  setup(userOptions, nuxt) {
    const logger = useLogger(NAME)
    const { resolve } = createResolver(import.meta.url)

    logger.info(`Adding ${NAME} module...`, userOptions)

    // 1. Set up runtime configuration
    const options = defu(nuxt.options.runtimeConfig.public[configKey], {
      verifyClientOnEveryRequest: true,
      baseUrl: ""
    })
    nuxt.options.runtimeConfig.public[configKey] = options

    // 2. Add composables
    addImports([{ name: "useAuth", from: resolve("./runtime/composables/useAuth") }])

    // 3. Create virtual imports for server-side
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(typeof nitroConfig.externals === "object" ? nitroConfig.externals : {}, {
        inline: [resolve("./runtime")]
      })
      nitroConfig.alias["#auth"] = resolve("./runtime/lib")
    })

    // 4.. Add types
    addTemplate({
      filename: "types/auth.d.ts",
      getContents: () => [
        "declare module '#auth' {",
        `  const getServerSession: typeof import('${resolve("./runtime/lib/server")}').getServerSession`,
        `  const NuxtAuthHandler: typeof import('${resolve("./runtime/lib/server")}').NuxtAuthHandler`,
        "}"
      ].join("\n")
    })

    nuxt.hook("prepare:types", (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, "types/auth.d.ts") })
    })

    // 5. Add plugin & middleware
    addPlugin(resolve("./runtime/plugin"))
    logger.success(`Added ${NAME} module successfully.`)
  }
})
