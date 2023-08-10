import type { ModuleOptions } from "./module";

declare module "@nuxt/schema" {
    interface RuntimeConfig {
      authJs: ModuleOptions
    }
    interface PublicRuntimeConfig {
      authJs: ModuleOptions
    }
}

export {}
