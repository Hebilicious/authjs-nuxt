import { parse } from "cookie-es"
import type { H3Event, RequestHeaders } from "h3"
import { getRequestHeaders, getRequestURL, readRawBody } from "h3"
import type { RuntimeConfig } from "@nuxt/schema"

export const configKey = "authJs" as const

/**
 * Get the AuthJS secret. For internal use only.
 * @returns The secret used to sign the JWT Token
 */
export function getAuthJsSecret(runtimeConfig?: Partial<RuntimeConfig>) {
  const secret = runtimeConfig?.authJs?.secret
    || process.env.NUXT_NEXTAUTH_SECRET
    || process.env.NUXT_AUTH_JS_SECRET
    || process.env.NEXTAUTH_SECRET
    || process.env.AUTH_SECRET
  if (!secret) throw new Error("[authjs-nuxt] No secret found, please set a secret in your [...].ts handler or use environment variables")
  return secret
}

export function getConfigBaseUrl(runtimeConfig?: Partial<RuntimeConfig>) {
  return (
    runtimeConfig?.public?.authJs?.baseUrl
    || process.env.NUXT_NEXTAUTH_URL
    || process.env.NUXT_AUTH_JS_BASE_URL
    || process.env.NEXTAUTH_URL
    || process.env.AUTH_ORIGIN
    || ""
  )
}

export function getServerOrigin(event: H3Event, runtimeConfig?: Partial<RuntimeConfig>) {
  const requestOrigin = getRequestHeaders(event).Origin
  const serverOrigin = getConfigBaseUrl(runtimeConfig)
  const origin = requestOrigin || serverOrigin
  if (!origin) throw new Error("No Origin found ...")
  return origin
}

export function checkOrigin(request: Request, runtimeConfig: Partial<RuntimeConfig>) {
  if (process.env.NODE_ENV === "development") return
  if (request.method !== "POST") return // Only check post requests
  const requestOrigin = request.headers.get("Origin")
  const serverOrigin = getConfigBaseUrl(runtimeConfig)
  if (serverOrigin !== requestOrigin) throw new Error("CSRF protected")
}

export function mergeCookieObject(headers: Record<string, string>, cookieName: string) {
  return Object.entries(headers)
    .filter(([k]) => k.includes(cookieName))
    .flatMap(([, v]) => v)
    .join("")
}

export function makeCookiesFromCookieString(cookieString: string | null) {
  if (!cookieString) return {}
  return Object.fromEntries(
    Object.entries(parse(cookieString))
      .filter(([k]) => k.includes("next-auth"))
  )
}

export function makeNativeHeadersFromCookieObject(
  headers: Record<string, string>
) {
  return makeNativeHeaders(headers, ([key, value]) => ["set-cookie", `${key}=${value}`])
}

/**
 * This should be a function in H3
 * @param headers RequestHeaders
 * @returns Headers
 */
export function makeNativeHeaders(
  headers: RequestHeaders,
  mapFn = ([key, value]: [string, string]): [string, string] => [key, value]
) {
  return new Headers(
    Object.entries(headers)
      .filter(([, value]) => !!value)
      .map(([key, value]) => mapFn([key, value!]))
  )
}

export function makeObjectFromNativeHeader(headers: Headers) {
  return Array.from(headers)
    .filter(([key]) => key === "set-cookie")
    .reduce<Record<string, string>>(
      (sum, [, value]) => ({ ...sum, ...makeCookiesFromCookieString(value) }),
      {}
    )
}

/**
 * This should be a function in H3
 * @param event
 * @returns
 */
export async function getRequestFromEvent(event: H3Event) {
  const url = new URL(getRequestURL(event))
  const method = event.method
  const body = method === "POST" ? await readRawBody(event) : undefined
  return new Request(url, { headers: getRequestHeaders(event) as any, method, body })
}
