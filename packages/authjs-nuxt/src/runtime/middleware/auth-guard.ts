import { useAuth } from "../composables/useAuth"
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#imports"

/**
 * This middleware is the guard for our private pages.
 */
export default defineNuxtRouteMiddleware(async () => {
  const { status } = useAuth()
  if (status.value === "authenticated") return
  const route = useRuntimeConfig()?.public?.authJs?.guestRedirectTo ?? "/"
  return navigateTo(route)
})
