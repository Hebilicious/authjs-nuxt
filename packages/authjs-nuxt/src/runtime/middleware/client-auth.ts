import { verifyClientSession } from "../lib"
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#imports"

/**
 * This middleware makes sure that the token is valid
 * during the SPA routing.
 * TODO: Add a verify delay of n minute to avoid client requesting the server on every SPA route change.
 */

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return
  const valid = await verifyClientSession()
  if (["client-auth", "auth"].includes(to.meta.middleware) || to.meta.auth === true)
    if (!valid) return navigateTo(useRuntimeConfig()?.public?.authJs?.guestRedirectTo ?? "/")
})
