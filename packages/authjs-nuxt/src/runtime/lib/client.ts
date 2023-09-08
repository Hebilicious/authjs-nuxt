/// <reference path="./client.d.ts" />
// @todo find a way to make this reference work
import type { BuiltInProviderType, Provider, RedirectableProviderType } from "@auth/core/providers"
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

type SignInResponse = Awaited<ReturnType<typeof postToInternal>>
type ProviderID<P> = LiteralUnion<P extends RedirectableProviderType ? P | BuiltInProviderType : BuiltInProviderType>

/**
 * Client-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signin)
 */

export async function signIn<P extends RedirectableProviderType | undefined = undefined>(
  providerId?: ProviderID<P>,
  options?: SignInOptions & { redirect: true },
  authorizationParams?: SignInAuthorizationParams
): Promise<void>

export async function signIn<P extends RedirectableProviderType | undefined = undefined>(
  providerId?: ProviderID<P>,
  options?: SignInOptions & { redirect: false },
  authorizationParams?: SignInAuthorizationParams
): Promise<SignInResponse>

export async function signIn<P extends RedirectableProviderType | undefined = undefined>(
  providerId?: ProviderID<P>,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
): Promise<void | SignInResponse> {
  const { status } = useAuth()
  try {
    status.value = "loading"
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
    if (isCredentials && !redirect) reloadNuxtApp({ persistState: true, force: true })
    if (redirect || !isSupportingReturn) {
      const to = url ?? callbackUrl
      // eslint-disable-next-line no-console
      console.log(`Redirecting, navigating to ${to}`)
      await navigateTo(to, { external: true })
      // If url contains a hash, the browser does not reload the page. We reload manually
      if (to?.includes("#")) reloadNuxtApp({ persistState: true, force: true })
      return
    }
    return response
  }
  catch (error) {
    status.value = "error"
    throw error
  }
}

/**
 * Signs the user out, by removing the session cookie.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signout)
 */
export async function signOut(options?: SignOutParams) {
  const { status } = useAuth()
  try {
    status.value = "unauthenticated"
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
  catch (error) {
    status.value = "error"
    throw error
  }
}

/**
 * Retrieve the list of providers currently configured.
 * See [OAuth Sign In](https://authjs.dev/guides/basics/pages#oauth-sign-in) for more details.
 */
export async function getProviders() {
  return $fetch<Record<string, Provider>[]>("/api/auth/providers")
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
