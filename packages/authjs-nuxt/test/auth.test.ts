import { describe, expect, it } from "vitest"
import { checkOrigin, makeCookiesFromCookieString, makeNativeHeaders, makeNativeHeadersFromCookieObject } from "../src/runtime/utils"

// eslint-disable-next-line antfu/top-level-function
const mockRuntimeConfig = (baseUrl = "https://example.com") =>
  ({ public: { authJs: { baseUrl, verifyClientOnEveryRequest: true, guestRedirectTo: "/" } } })

describe("all", () => {
  it("can transform cookie object into headers", () => {
    const cookies = { hello: "world", hi: "there" }
    const headers = makeNativeHeadersFromCookieObject(cookies)
    expect(headers.get("set-cookie")).toBe("hello=world, hi=there")
    expect(headers instanceof Headers).toBe(true)
  })

  it("can transform Request headers into regular headers", () => {
    const headers = { hello: "world", hi: "there" }
    const nativeHeaders = makeNativeHeaders(headers)
    expect(nativeHeaders.get("hello")).toBe("world")
    expect(nativeHeaders.get("hi")).toBe("there")
  })

  it("can make cookies from cookie string", () => {
    const cookieString = "next.hello=world; hi=there"
    const cookies = makeCookiesFromCookieString(cookieString)
    expect(cookies["next.hello"]).toBe("world")
    expect(cookies.hi).toBeUndefined()
  })

  it("throws an error if the origin header is not set", () => {
    const url = "https://example.com"
    expect(() => checkOrigin(new Request(url, { method: "POST" }), mockRuntimeConfig(url)))
      .toThrowError("CSRF protected")
  })

  it("is undefined is the Origin is checked ", () => {
    const url = "https://example.com"
    expect(checkOrigin(new Request(url, { method: "POST", headers: { Origin: url } }), mockRuntimeConfig(url)))
      .toBeUndefined()
  })
})
