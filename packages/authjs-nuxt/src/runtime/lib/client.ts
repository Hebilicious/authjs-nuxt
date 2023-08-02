import type { BuiltInProviderType, RedirectableProviderType } from "@auth/core/providers"
import type { Session } from "@auth/core/types"
import { makeNativeHeadersFromCookieObject } from "../utils"
import { useAuth } from "../composables/useAuth"
import type { LiteralUnion, SignInAuthorizationParams, SignInOptions, SignOutParams } from "./types"
import { navigateTo, reloadNuxtApp, useRouter } from "#imports"

async function postToInternal({
  url,
  options,
  csrfToken,
  callbackUrl
}: {
  url: string
  options: SignInOptions | undefined
  csrfToken?: string
  callbackUrl: string
}) {
  const response = await $fetch.raw<{ url: string }>(url, {
    method: "POST",
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
  return response
}
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

  // TODO: Support custom providers
  const isCredentials = providerId === "credentials"
  const isEmail = providerId === "email"
  const isSupportingReturn = isCredentials || isEmail

  // TODO: Handle custom base path
  const signInUrl = `/api/auth/${isCredentials ? "callback" : "signin"}/${providerId}`
  const _signInUrl = `${signInUrl}?${new URLSearchParams(authorizationParams)}`

  // TODO: Handle custom base path

  // We check the origin so CSRF check is un-necessary
  // const { data: csrf } = await useFetch<{ csrfToken: string }>("/api/auth/csrf")
  // const csrfToken = csrf?.value?.csrfToken
  // if (!csrfToken) throw new Error("CSRF token not found")

  const response = await postToInternal({ url: _signInUrl, options, callbackUrl })
  const url = response?._data?.url ?? null
  const error = url ? new URL(url).searchParams.get("error") : null
  if (error) throw new Error(error)
  if (redirect || !isSupportingReturn) {
    // TODO: Do not redirect for Credentials and Email providers by default in next major
    const to = url ?? callbackUrl
    await navigateTo(to, { external: true })
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (to?.includes("#")) reloadNuxtApp({ persistState: true })
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
  const data = await $fetch<{ url: string }>("/api/auth/signout", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1"
    },
    body: new URLSearchParams({
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
  if (url.includes("#")) reloadNuxtApp({ persistState: true })
}

/**
 * Retrieve the list of providers currently configured.
 * See [OAuth Sign In](https://authjs.dev/guides/basics/pages#oauth-sign-in) for more details.
 */
export async function getProviders() {
  const data = await $fetch<Record<string, unknown>[]>("/api/auth/providers")
  return data
}

/**
 * Verify if the user session is still valid
 * TODO: Any type of refresh logic should be handled here
 * @returns true if the user is signed in, false otherwise
 */
export async function verifyClientSession() {
  const { updateSession, cookies, removeSession } = useAuth()
  try {
    if (cookies.value === null)
      throw new Error("No session found")

    const data = await $fetch<Session>("/api/auth/session", {
      headers: makeNativeHeadersFromCookieObject(cookies.value)
    })
    const hasSession = data && Object.keys(data).length

    if (hasSession) updateSession(data)
    if (!hasSession) throw new Error("No session found")

    return true
  }
  catch (error) {
    removeSession()
    return false
  }
}
