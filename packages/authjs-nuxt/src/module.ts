import { addImports, addPlugin, addTypeTemplate, createResolver, defineNuxtModule, useLogger } from "@nuxt/kit"
import { defu } from "defu"
import { configKey } from "./runtime/utils"

const NAME = "@auth/nuxt"

export interface ModuleOptions {
  verifyClientOnEveryRequest?: boolean
  guestRedirectTo?: string
  authenticatedRedirectTo?: string
  baseUrl: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: NAME,
    configKey
  },
  defaults: {
    verifyClientOnEveryRequest: true,
    guestRedirectTo: "/",
    authenticatedRedirectTo: "/",
    baseUrl: ""
  },
  setup(userOptions, nuxt) {
    const logger = useLogger(NAME)
    const { resolve } = createResolver(import.meta.url)

    logger.info(`Adding ${NAME} module...`, userOptions)

    // 1. Set up runtime configuration
    const options = defu(nuxt.options.runtimeConfig.public[configKey], userOptions)
    nuxt.options.runtimeConfig.public[configKey] = options

    // 2. Alias @auth/core dependencies to their browser version
    // @todo This isn't needed for node, apply this based on Nitro settings
    nuxt.options.alias = defu(nuxt.options.alias, {
      "jose": resolve(__dirname, "../node_modules/jose/dist/browser/index.js"),
      "@panva/hkdf": resolve(__dirname, "../node_modules/@panva/hkdf/dist/web/index.js")
    })

    // 3. Add composables
    addImports([{ name: "useAuth", from: resolve("./runtime/composables/useAuth") }])

    // 4. Create virtual imports for server-side
    // @todo Contribute an helper to nuxt/kit to handle this scenario like this
    // addLibrary({name: "#auth", type: "server", from: "./runtime/lib/server"})
    // addLibrary({name: "#auth", type: "client", from: "./runtime/lib/client"})

    // These will be available only in the /server directory
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias["#auth"] = resolve("./runtime/lib/server")
    })

    // These will be available outside of the /server directory
    nuxt.options.alias["#auth"] = resolve("./runtime/lib/client")
    // nuxt.options.build.transpile.push(resolve("./runtime/lib/client")) This doesn't look it's needed ?

    // 4. Add types
    addTypeTemplate({
      filename: "types/auth.d.ts",
      write: true,
      getContents: () => [
        "declare module '#auth' {",
        `  const verifyClientSession: typeof import('${resolve("./runtime/lib/client")}').verifyClientSession`,
        `  const signIn: typeof import('${resolve("./runtime/lib/client")}').signIn`,
        `  const signOut: typeof import('${resolve("./runtime/lib/client")}').signOut`,
        `  const getServerSession: typeof import('${resolve("./runtime/lib/server")}').getServerSession`,
        `  const NuxtAuthHandler: typeof import('${resolve("./runtime/lib/server")}').NuxtAuthHandler`,
        `  const getServerToken: typeof import('${resolve("./runtime/lib/server")}').getServerToken`,
        "}"
      ].join("\n")
    })

    // 5. Add plugin & middleware
    addPlugin(resolve("./runtime/plugin"))
    logger.success(`Added ${NAME} module successfully.`)
  }
})
