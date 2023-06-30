import crypto from "node:crypto"
import type { RuntimeConfig } from "nuxt/schema"
import { Auth, skipCSRFCheck } from "@auth/core"
import type { GetTokenParams } from "@auth/core/jwt"
import { getToken as authGetToken } from "@auth/core/jwt"
import type { H3Event } from "h3"
import { eventHandler, getRequestHeaders, getRequestURL } from "h3"
import type { AuthConfig, Session } from "@auth/core/types"
import { checkOrigin, getRequestFromEvent, respondWithResponse } from "../utils"

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", {
    value: crypto,
    writable: false,
    configurable: true
  })
}

export const isProduction = process.env.NODE_ENV === "production"

let usedSecret: string | undefined

/**
 * This is the event handler for the catch-all route.
 * Everything can be customized by adding a custom route that takes priority over the handler.
 * @param options
 * @param runtimeConfig
 * @returns
 */
export function NuxtAuthHandler(options: AuthConfig, runtimeConfig: RuntimeConfig) {
  return eventHandler(async (event) => {
    options.trustHost ??= true
    options.skipCSRFCheck = skipCSRFCheck
    usedSecret = options?.secret
    if (!usedSecret) {
      if (isProduction) {
        throw new Error("No secret")
      }
      else {
        // eslint-disable-next-line no-console
        console.log("No secret!")
        usedSecret = "secret"
      }
    }
    const request = await getRequestFromEvent(event)
    if (request.url.includes(".js.map")) return // Do not handle source maps
    checkOrigin(request, runtimeConfig)
    const response = await Auth(request, options)
    return respondWithResponse(event, response)
  })
}

export async function getServerSession(
  event: H3Event,
  options: AuthConfig
): Promise<Session | null> {
  options.trustHost ??= true

  const url = new URL("/api/auth/session", getRequestURL(event))

  const response = await Auth(
    new Request(url, { headers: getRequestHeaders(event) as any }),
    options
  )

  const { status = 200 } = response
  const data = await response.json()

  if (!data || !Object.keys(data).length)
    return null
  if (status === 200)
    return data
  throw new Error(data.message)
}

function getServerOrigin(): string {
  // Prio 1: Environment variable
  const envOrigin = process.env.AUTH_ORIGIN
  if (envOrigin)
    return envOrigin

  // Prio 2: Runtime configuration
  const runtimeConfigOrigin = useRuntimeConfig().public.authJs.baseUrl
  if (runtimeConfigOrigin)
    return runtimeConfigOrigin

  throw new Error("No Origin")
}

/**
 * Returns the JWT Token defined
 * @param event H3 Event
 * @param secureCookie Whether the cookie is secure or not
 * @param secret cookie encryption secret
 * @param rest rest of the config
 * @returns JWT Token
 */
export function getToken<R extends boolean = false>({ event, secureCookie, secret, ...rest }: Omit<GetTokenParams<R>, "req"> & { event: H3Event }) {
  return authGetToken({
    req: {
      cookies: parseCookies(event),
      // @ts-expect-error type [name: string]: string can be mapped to String Record<String>
      headers: getHeaders(event)
    },
    // see https://github.com/nextauthjs/next-auth/blob/8387c78e3fef13350d8a8c6102caeeb05c70a650/packages/next-auth/src/jwt/index.ts#L73
    secureCookie: secureCookie || getServerOrigin().startsWith("https://"),
    secret: secret || usedSecret,
    ...rest
  })
}
