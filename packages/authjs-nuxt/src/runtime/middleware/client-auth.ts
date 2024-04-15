import { verifyClientSession } from "../lib"
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#imports"

/**
 * This middleware makes sure that the token is valid
 * during the SPA routing.
 * TODO: Add a verify delay of n minute to avoid client requesting the server on every SPA route change.
 */

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  const valid = await verifyClientSession()
  if (valid) return
  if (["client-auth", "auth"].includes(to.meta.middleware) || to.meta.auth === true)
    return navigateTo(to?.meta?.auth?.guestRedirectTo ?? useRuntimeConfig()?.public?.authJs?.guestRedirectTo ?? "/")
})
