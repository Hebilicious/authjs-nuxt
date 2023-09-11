import { addImports, addPlugin, addRouteMiddleware, addTypeTemplate, createResolver, defineNuxtModule, useLogger } from "@nuxt/kit"
import { defu } from "defu"
import { configKey } from "./runtime/utils"

const NAME = "@auth/nuxt"

export interface ModuleOptions {
  verifyClientOnEveryRequest?: boolean
  guestRedirectTo?: string
  authenticatedRedirectTo?: string
  serverUrl: string
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
    serverUrl: ""
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
    // addLibrary({
    //   alias: "#auth",
    //   server: {
    //     from: "./runtime/lib/server", autoImport: true // include: [], exclude: []
    //   },
    //   client: { from: "./runtime/lib/client" }, // by default include all exports,
    //   universal: { from: "./runtime/lib/universal" }
    // })

    const serverUtilities = ["getAuthJsSession", "NuxtAuthJsHandler", "getAuthJsToken", "defineAuthJsConfig"]
    const serverLib = resolve("./runtime/lib/server")

    const clientUtilities = ["verifyClientSession", "signIn", "signOut"]
    const clientLib = resolve("./runtime/lib/client")

    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias["#auth"] = serverLib
      // add to externals
      nitroConfig.externals = defu(nitroConfig.externals, {
        inline: [serverLib]
      })
      // add to imports
      nitroConfig.imports = defu(nitroConfig.imports, {
        presets: [
          {
            from: serverLib,
            imports: serverUtilities
          }
        ]
      })
    })

    // 4. Add types
    addTypeTemplate({
      filename: "types/auth.d.ts",
      getContents: () => [
        "declare module '#auth' {",
        ...clientUtilities.map(name => `const ${name}: typeof import('${clientLib}').${name}`),
        ...serverUtilities.map(name => `const ${name}: typeof import('${serverLib}').${name}`),
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
