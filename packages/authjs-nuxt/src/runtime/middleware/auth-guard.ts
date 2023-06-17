import { useAuth } from "../composables/useAuth"
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#imports"

/**
 * This middleware is the guard for our private pages.
 */
export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.middleware !== "auth") return
  const { status } = useAuth()
  const url = useRuntimeConfig()?.public?.authJs?.guestRedirectTo ?? "/"
  if (status.value !== "authenticated") return navigateTo(url)
})
