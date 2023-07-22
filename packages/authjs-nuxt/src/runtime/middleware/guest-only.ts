import { useAuth } from "../composables/useAuth"

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
