import type { Session } from "@auth/core/types"
import { useAuth } from "./composables/useAuth"
import { configKey, makeCookiesFromCookieString } from "./utils"
import authMiddleware from "./middleware/auth-guard"
import clientMiddleware from "./middleware/client-auth"
import guestOnlyMiddleware from "./middleware/guest-only"
import { addRouteMiddleware, defineNuxtPlugin, useRequestHeaders, useRuntimeConfig } from "#app"

export default defineNuxtPlugin(async () => {
  const { updateSession, removeSession, cookies } = useAuth()

  const config = useRuntimeConfig().public[configKey]

  addRouteMiddleware("auth", authMiddleware)
  addRouteMiddleware("guest-only", guestOnlyMiddleware)
  addRouteMiddleware("client-auth", clientMiddleware, { global: config.verifyClientOnEveryRequest })

  // We try to get the session when the app SSRs. No need to repeat this on the client.
  if (process.server) {
    const headers = useRequestHeaders() as any
    const data = await $fetch<Session>("/api/auth/session", {
      headers
    })
    const hasSession = data && Object.keys(data).length
    if (hasSession) updateSession(data)
    if (!hasSession) removeSession()
    cookies.value = makeCookiesFromCookieString(headers.cookie)
  }
})
