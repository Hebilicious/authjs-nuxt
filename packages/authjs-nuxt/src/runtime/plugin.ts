import type { Session } from "@auth/core/types"
import { joinURL } from "ufo"
import { useAuth } from "./composables/useAuth"
import { makeCookiesFromCookieString } from "./utils"
import { defineNuxtPlugin, useRequestHeaders } from "#app"

import { basePath } from "#auth-config"

export default defineNuxtPlugin(async () => {
  // We try to get the session when the app SSRs. No need to repeat this on the client.
  if (import.meta.server) {
    const { updateSession, removeSession, cookies } = useAuth()
    const headers = useRequestHeaders() as any
    const data = await $fetch<Session>(joinURL(basePath, "session"), {
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
