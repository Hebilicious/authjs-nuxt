import { verifyClientSession } from "../lib"
import { defineNuxtRouteMiddleware, navigateTo } from "#app"

/**
 * This middleware makes sure that the token is valid
 * during the SPA routing.
 * TODO: Add a verify delay of n minute to avoid client requesting the server on every SPA route change.
 */

const loginPageUrl = "/" // TODO: Configurable
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.meta.middleware !== "auth")
    return
  if (process.client) {
    const valid = await verifyClientSession()
    if (!valid)
      return navigateTo(loginPageUrl)
  }
})
