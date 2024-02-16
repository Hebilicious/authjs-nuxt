import { addImports, addPlugin, addRouteMiddleware, addTypeTemplate, createResolver, defineNuxtModule, useLogger } from "@nuxt/kit"
import { defu } from "defu"
import { configKey } from "./runtime/utils"

const PACKAGE_NAME = "@auth/nuxt"

export interface ModuleOptions {
  secret?: string
  baseUrl?: string
  verifyClientOnEveryRequest?: boolean
  guestRedirectTo?: string
  authenticatedRedirectTo?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: PACKAGE_NAME,
    configKey
  },
  defaults: {
    secret: "",
    baseUrl: "",
    verifyClientOnEveryRequest: true,
    guestRedirectTo: "/",
    authenticatedRedirectTo: "/"
  },
  setup(moduleOptions, nuxt) {
    const logger = useLogger(PACKAGE_NAME)
    const { resolve } = createResolver(import.meta.url)

    logger.info(`Adding ${PACKAGE_NAME} module...`)

    // 1. Set up runtime configuration

    // Private runtime config
    nuxt.options.runtimeConfig[configKey] = defu(
      nuxt.options.runtimeConfig[configKey],
      { secret: moduleOptions.secret }
    ) as Pick<ModuleOptions, "secret">

    // Public runtime config
    nuxt.options.runtimeConfig.public[configKey] = defu(nuxt.options.runtimeConfig.public[configKey], {
      baseUrl: moduleOptions.baseUrl,
      verifyClientOnEveryRequest: moduleOptions.verifyClientOnEveryRequest,
      guestRedirectTo: moduleOptions.guestRedirectTo,
      authenticatedRedirectTo: moduleOptions.authenticatedRedirectTo
    }) as Omit<ModuleOptions, "secret">

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
    addRouteMiddleware({ name: "client-auth", path: resolve("./runtime/middleware/client-auth"), global: nuxt.options.runtimeConfig.public[configKey].verifyClientOnEveryRequest })

    logger.success(`Added ${PACKAGE_NAME} module successfully.`)
  }
})
