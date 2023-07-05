import { useAuth } from "../composables/useAuth"
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#imports"

/**
 * This middleware is the guard for our private pages.
 */
export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.auth !== true) return
  const { status } = useAuth()
  if (status.value === "authenticated") return
  return navigateTo(useRuntimeConfig()?.public?.authJs?.guestRedirectTo ?? "/")
})
