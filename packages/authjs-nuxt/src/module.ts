import { addImports, addPlugin, addRouteMiddleware, addTypeTemplate, createResolver, defineNuxtModule, useLogger } from "@nuxt/kit"
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

    // 5. Add plugin
    addPlugin(resolve("./runtime/plugin"))

    // 6. Add middlewares
    addRouteMiddleware({ name: "auth", path: resolve("./runtime/middleware/auth") })
    addRouteMiddleware({ name: "guest-only", path: resolve("./runtime/middleware/guest-only") })
    addRouteMiddleware({ name: "client-auth", path: resolve("./runtime/middleware/client-auth"), global: options.verifyClientOnEveryRequest })

    logger.success(`Added ${NAME} module successfully.`)
  }
})
