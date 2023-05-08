import type { Session } from "@auth/core/types"
import { produce } from "immer"
import { computed, readonly, watch } from "vue"
import * as auth from "../lib"
import { useState } from "#app"

export function useAuth() {
  const session = useState<Session | null>("auth:session", () => null)
  const cookies = useState<Record<string, string> | null>("auth:cookies", () => ({}))
  const status = useState<"loading" | "authenticated" | "unauthenticated" | "error">(
    "auth:session:status",
    () => "unauthenticated"
  )
  const sessionToken = computed(() => cookies.value?.["next-auth.session-token"] ?? "")

  watch(session, (newSession) => {
    if (newSession === null)
      return (status.value = "unauthenticated")
    if (Object.keys(newSession).length)
      return (status.value = "authenticated")
  })

  const updateSession = (u: (() => unknown) | Session | null) => {
    session.value = typeof u === "function" ? produce(session.value, u) : u
  }

  const removeSession = () => {
    cookies.value = null
    updateSession(null)
  }

  const signIn: (...args: Parameters<typeof auth.signIn>) => void = async (...args) => {
    try {
      status.value = "loading"
      await auth.signIn(...args)
    }
    catch (error) {
      status.value = "error"
      throw error
    }
  }

  const signOut: (...args: Parameters<typeof auth.signOut>) => ReturnType<typeof auth.signOut> = (
    ...args
  ) => {
    try {
      status.value = "unauthenticated"
      return auth.signOut(...args)
    }
    catch (error) {
      status.value = "error"
      throw error
    }
  }

  return {
    session: readonly(session),
    updateSession,
    status: readonly(status),
    signIn,
    signOut,
    cookies,
    sessionToken,
    removeSession
  }
}
