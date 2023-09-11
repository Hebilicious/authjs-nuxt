import type { Session, User } from "@auth/core/types"
import { produce } from "immer"
import { type ComputedRef, type Ref, computed, readonly, watch } from "vue"
import { getProviders, signIn, signOut } from "../lib/client"
import { useState } from "#imports"

// @note the `as Type` statements are necessary for rollup to generate the correct types

export function useAuth() {
  const session = useState("auth:session", () => null) as Ref<Session | null>
  const cookies = useState("auth:cookies", () => ({})) as Ref<Record<string, string> | null>
  const status = useState("auth:session:status", () => "unauthenticated") as Ref<"loading" | "authenticated" | "unauthenticated" | "error">
  const sessionToken = computed(() => cookies.value?.["next-auth.session-token"] ?? "")
  const user = computed(() => session.value?.user ?? null) as ComputedRef<User | null>
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

  return {
    session: readonly(session) as Readonly<Ref<Session | null>>,
    user,
    updateSession,
    status,
    cookies,
    sessionToken,
    removeSession,
    signIn,
    signOut,
    getProviders
  }
}
