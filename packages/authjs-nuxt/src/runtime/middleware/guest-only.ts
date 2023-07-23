import { useAuth } from "../composables/useAuth"
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#imports"

/**
 * Prevents authenticated users from accessing guest-only pages. Ideal for pages like login and register.
 */
export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth()
  if (status.value === "authenticated") {
    return navigateTo(to?.meta?.auth?.authenticatedRedirectTo
      ?? useRuntimeConfig()?.public?.authJs?.authenticatedRedirectTo ?? "/")
  }
})
