import type { ModuleOptions } from "./module";

declare module "@nuxt/schema" {
  interface RuntimeConfig {
    authJs: Pick<ModuleOptions, 'secret'>
  }
  interface PublicRuntimeConfig {
    authJs: Omit<ModuleOptions, 'secret'>
  }
}

declare module "nuxt/schema" {
  interface RuntimeConfig {
    authJs: Pick<ModuleOptions, 'secret'>
  }
  interface PublicRuntimeConfig {
    authJs: Omit<ModuleOptions, 'secret'>
  }
}

export { }
