import type { Session } from "@auth/core/types"
import { useAuth } from "./composables/useAuth"
import { makeCookiesFromCookieString } from "./utils"
import { defineNuxtPlugin, useRequestHeaders } from "#app"

export default defineNuxtPlugin(async () => {
  // We try to get the session when the app SSRs. No need to repeat this on the client.
  if (import.meta.server) {
    const { updateSession, removeSession, cookies } = useAuth()
    const headers = useRequestHeaders() as any
    const data = await $fetch<Session>("/api/auth/session", {
      headers
    })
    const hasSession = data && Object.keys(data).length
    if (hasSession) {
      updateSession(data)
      cookies.value = makeCookiesFromCookieString(headers.cookie)
    }
    if (!hasSession) removeSession()
  }
})
