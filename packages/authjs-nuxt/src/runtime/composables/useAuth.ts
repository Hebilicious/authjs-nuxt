import type { Session } from "@auth/core/types"
import { produce } from "immer"
import { type Ref, computed, readonly, watch } from "vue"
import * as auth from "../lib"
import { useState } from "#imports"

export function useAuth() {
  const session = useState("auth:session", () => null) as Ref<Session | null>
  const cookies = useState("auth:cookies", () => ({})) as Ref<Record<string, string> | null>
  const status = useState("auth:session:status", () => "unauthenticated") as Ref<"loading" | "authenticated" | "unauthenticated" | "error">
  const sessionToken = computed(() => cookies.value?.["next-auth.session-token"] ?? "")
  const user = computed(() => session.value?.user ?? null)
  watch(session, (newSession: Session | null) => {
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

  const getProviders: () => ReturnType<typeof auth.getProviders> = () => {
    return auth.getProviders()
  }

  return {
    session: readonly(session),
    user,
    updateSession,
    status: readonly(status),
    signIn,
    signOut,
    cookies,
    sessionToken,
    removeSession,
    getProviders
  }
}
