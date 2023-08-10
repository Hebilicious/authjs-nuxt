import type { AuthConfig } from "@auth/core"
import { parse } from "cookie-es"
import type { H3Event, RequestHeaders } from "h3"
import { getMethod, getRequestHeaders, getRequestURL, readRawBody } from "h3"
import type { RuntimeConfig } from "@nuxt/schema"

export const configKey = "authJs"

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
  const serverOrigin = runtimeConfig?.public?.authJs?.baseUrl ?? ""
  const origin = requestOrigin ?? serverOrigin.length > 0 ? serverOrigin : process.env.AUTH_ORIGIN
  if (!origin) throw new Error("No Origin found ...")
  return origin
}

export function checkOrigin(request: Request, runtimeConfig: Partial<RuntimeConfig>) {
  if (process.env.NODE_ENV === "development") return
  if (request.method !== "POST") return // Only check post requests
  const requestOrigin = request.headers.get("Origin")
  const serverOrigin = runtimeConfig.public?.authJs?.baseUrl
  if (serverOrigin !== requestOrigin)
    throw new Error("CSRF protected")
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
 * @param headers RequestHeaders
 * @returns Headers
 */
export function makeNativeHeaders(headers: RequestHeaders) {
  const nativeHeaders = new Headers()
  Object.entries(headers).forEach(([key, value]) => {
    if (value) nativeHeaders.append(key, value)
  })
  return nativeHeaders
}

/**
 * This should be a function in H3
 * @param event
 * @returns
 */
export async function getRequestFromEvent(event: H3Event) {
  const url = new URL(getRequestURL(event))
  const method = getMethod(event)
  const body = method === "POST" ? await readRawBody(event) : undefined
  return new Request(url, { headers: getRequestHeaders(event) as any, method, body })
}
