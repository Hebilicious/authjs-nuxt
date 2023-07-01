import { configKey } from "./runtime/utils";
import type { ModuleOptions } from "./module";

declare module "@nuxt/schema" {
    interface PublicRuntimeConfig {
      [configKey]: ModuleOptions
    }
}
  
export { }
  