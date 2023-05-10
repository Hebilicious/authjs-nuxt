import { useAuth } from "../composables/useAuth"
import { defineNuxtRouteMiddleware, navigateTo } from "#imports"

/**
 * This middleware is the guard for our private pages.
 */
export default defineNuxtRouteMiddleware(() => {
  const { status } = useAuth()
  if (status.value !== "authenticated")
    return navigateTo("/")
})
