import {
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
  useLogger
} from "@nuxt/kit"
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
    const options = defu(userOptions, { verifyClientOnEveryRequest: true })
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
    nuxt.options.runtimeConfig.public[configKey] = options

    // 2. Add composables
    addImports([
      { name: "useAuth", from: resolve("./runtime/composables/useAuth") }
    ])

    // 3. Add plugins & middlewares
    addPlugin(resolve("./runtime/plugin"))

    logger.success(`Added ${NAME} module successfully.`)
  }
})
