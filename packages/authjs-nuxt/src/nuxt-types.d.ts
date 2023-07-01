import { configKey } from "./runtime/utils";

declare module "@nuxt/schema" {
    interface PublicRuntimeConfig {
      [configKey]: ModuleOptions
    }
}
  
export { }
  