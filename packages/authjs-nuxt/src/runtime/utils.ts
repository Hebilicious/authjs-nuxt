import { parse } from "cookie-es"
import type { H3Event, RequestHeaders } from "h3"
import { getMethod, getRequestHeaders, getRequestURL, readRawBody, sendRedirect } from "h3"
import type { RuntimeConfig } from "@nuxt/schema"

export const configKey = "authJs"

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
    Object.entries(parse(cookieString)).filter(([k]) => k.startsWith("next"))
  )
}

export function makeNativeHeadersFromCookieObject(headers: Record<string, string>) {
  const nativeHeaders = new Headers(Object.entries(headers)
    .map(([key, value]) => ["Set-Cookie", `${key}=${value}`]) as HeadersInit)
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
  // rome-ignore lint/suspicious/noExplicitAny: The H3 type should be compatible with native headers ...
  return new Request(url, { headers: getRequestHeaders(event) as any, method, body })
}

/**
 * This should be a function in H3
 * @param event
 * @param response
 * @returns
 */
export async function respondWithResponse(event: H3Event, response: Response) {
  for (const [key, value] of response.headers)
    event.node.res.setHeader(key, value)

  if (response.status === 302 && response.headers.get("Location")) {
    event.node.res.statusCode = 302
    return sendRedirect(event, response.headers.get("Location") as string)
  }
  if (response.body) {
    for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>)
      event.node.res.write(chunk)
  }
  return event.node.res.end()
}
