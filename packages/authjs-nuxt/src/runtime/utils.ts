import type { AuthConfig } from "@auth/core"
import { parse } from "cookie-es"
import type { H3Event } from "h3"
import { getRequestHeaders, getRequestURL, readRawBody } from "h3"
import type { RuntimeConfig } from "@nuxt/schema"

export const configKey = "authJs" as const

/**
 * Get the AuthJS secret. For internal use only.
 * @returns The secret used to sign the JWT Token
 */
export function getAuthJsSecret(options: AuthConfig) {
  const secret = options?.secret || process.env.NUXT_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  if (!secret) throw new Error("[authjs-nuxt] No secret found, please set a secret in your [...].ts handler or use environment variables")
  return secret
}

export function getServerOrigin(event: H3Event, runtimeConfig?: Partial<RuntimeConfig>) {
  const requestOrigin = getRequestHeaders(event).Origin
  const origin = requestOrigin ?? runtimeConfig?.public?.authJs?.serverUrl ?? process.env.AUTH_ORIGIN
  if (!origin || origin.length === 0) throw new Error("No Origin found ...")
  return origin
}

export function checkOrigin(eventOrRequest: H3Event | Request, runtimeConfig: Partial<RuntimeConfig>) {
  if (process.env.NODE_ENV === "development") return
  if (eventOrRequest.method !== "POST") return // Only check post requests
  const requestOrigin = eventOrRequest instanceof Request ? eventOrRequest.headers.get("origin") : getRequestHeaders(eventOrRequest).Origin
  const serverOrigin = runtimeConfig?.public?.authJs?.serverUrl ?? process.env.AUTH_ORIGIN
  if (serverOrigin !== requestOrigin)
    throw new Error(`CSRF protected, Origin ${requestOrigin} does not match configuration.`)
}

export function makeCookiesFromCookieString(cookieString: string | null) {
  if (!cookieString) return {}
  return Object.fromEntries(
    Object.entries(parse(cookieString)).filter(([k]) => k.includes("next-auth"))
  )
}

export function makeNativeHeadersFromCookieObject(headers: Record<string, string>) {
  const nativeHeaders = new Headers(Object.entries(headers)
    .map(([key, value]) => ["set-cookie", `${key}=${value}`]) as HeadersInit)
  return nativeHeaders
}

/**
 * This should be a function in H3
 * @param event
 * @returns Request
 */
export async function getRequestFromEvent(event: H3Event) {
  const url = new URL(getRequestURL(event))
  const method = event.method
  const body = method === "POST" ? await readRawBody(event) : undefined
  return new Request(url, { headers: getRequestHeaders(event) as any, method, body })
}

const withoutTrailingSlash = (input: string): string => {
  const clean = input.endsWith("/") ? input.slice(0, -1) : input
  if (input.endsWith("/")) return withoutTrailingSlash(clean)
  return clean
}

const withoutLeadingSlash = (input: string): string => {
  const clean = input.startsWith("/") ? input.slice(1) : input
  if (input.startsWith("/")) return withoutLeadingSlash(clean)
  return clean
}

export function noSurroundingSlash(input: string) {
  return withoutLeadingSlash(withoutTrailingSlash(input))
}
