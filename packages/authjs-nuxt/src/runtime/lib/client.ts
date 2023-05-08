import type { BuiltInProviderType, RedirectableProviderType } from "@auth/core/providers"
import type { Session } from "@auth/core/types"
import { makeNativeHeadersFromCookieObject } from "../utils"
import { useAuth } from "../composables/useAuth"
import type { LiteralUnion, SignInAuthorizationParams, SignInOptions, SignOutParams } from "./types"
import { navigateTo, reloadNuxtApp, useFetch, useRouter } from "#app"

/**
 * Client-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signin)
 */
export async function signIn<P extends RedirectableProviderType | undefined = undefined>(
  providerId?: LiteralUnion<
    P extends RedirectableProviderType ? P | BuiltInProviderType : BuiltInProviderType
  >,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
) {
  const { callbackUrl = window.location.href, redirect = true } = options ?? {}
  // console.log("SIGNING in", { callbackUrl })

  // TODO: Support custom providers
  const isCredentials = providerId === "credentials"
  const isEmail = providerId === "email"
  const isSupportingReturn = isCredentials || isEmail

  // TODO: Handle custom base path
  const signInUrl = `/api/auth/${isCredentials ? "callback" : "signin"}/${providerId}`
  const _signInUrl = `${signInUrl}?${new URLSearchParams(authorizationParams)}`

  // TODO: Handle custom base path
  // This could be replaced by an origin check
  const { data: csrf } = await useFetch<{ csrfToken: string }>("/api/auth/csrf")
  const csrfToken = csrf?.value?.csrfToken
  if (!csrfToken)
    throw new Error("CSRF token not found")

  const response = await $fetch.raw<{ url: string }>(_signInUrl, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1"
    },
    // @ts-expect-error -- ignore
    body: new URLSearchParams({
      ...options,
      csrfToken,
      callbackUrl
    })
  })
  const url = response?._data?.url ?? null
  // if (!url) return response
  const error = url ? new URL(url).searchParams.get("error") : null
  if (redirect || !isSupportingReturn || !error) {
    // TODO: Do not redirect for Credentials and Email providers by default in next major
    const to = url ?? callbackUrl
    await navigateTo(to, { external: true })
    // window.location.href = url ?? callbackUrl
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (to?.includes("#"))
      reloadNuxtApp({ persistState: true })
    return
  }
  return response
}

/**
 * Signs the user out, by removing the session cookie.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signout)
 */
export async function signOut(options?: SignOutParams) {
  const { callbackUrl = window.location.href } = options ?? {}
  // TODO: Custom base path
  // This could be replaced by an origin check
  const { data: csrf } = await useFetch<{ csrfToken: string }>("/api/auth/csrf")
  const csrfToken = csrf?.value?.csrfToken
  if (!csrfToken)
    throw new Error("CSRF token not found")

  const data = await $fetch<{ url: string }>("/api/auth/signout", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1"
    },
    body: new URLSearchParams({
      csrfToken,
      callbackUrl
    })
  })
  // Remove the session
  useAuth().removeSession()

  // Navigate back to where we are.
  const url = data?.url ?? callbackUrl
  // await navigateTo(new URL(url).pathname, { replace: true })
  await useRouter().push({ path: new URL(url).pathname, force: true }) // navigateTo doesn't accept force
  // If url contains a hash, the browser does not reload the page. We reload manually
  if (url.includes("#"))
    reloadNuxtApp({ persistState: true })
}

/**
 * Verify if the user session is still valid
 * TODO: Any type of refresh logic should be handled here
 * @returns true if the user is signed in, false otherwise
 */
export async function verifyClientSession() {
  // console.log("Verifying client session ...")
  const { updateSession, cookies, removeSession } = useAuth()
  try {
    if (cookies.value === null)
      throw new Error("No session found")

    const data = await $fetch<Session>("/api/auth/session", {
      headers: makeNativeHeadersFromCookieObject(cookies.value)
    })
    const hasSession = data && Object.keys(data).length

    if (hasSession) {
      // console.log("Session found", data)
      updateSession(data)
    }

    if (!hasSession)
      throw new Error("No session found")

    return true
  }
  catch (error) {
    // console.log(error)
    removeSession()
    return false
  }
}
