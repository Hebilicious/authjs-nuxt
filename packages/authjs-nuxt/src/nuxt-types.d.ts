import type { ModuleOptions } from "./module";

declare module "@nuxt/schema" {
    interface PublicRuntimeConfig {
      authJs: ModuleOptions
    }
}

declare module "nuxt/schema" {
  interface PublicRuntimeConfig {
    authJs: ModuleOptions
  }
}

export {}
