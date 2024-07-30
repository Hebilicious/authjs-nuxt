import { describe, expect, it } from "vitest"
import { checkOrigin, makeCookiesFromCookieString, makeCookiesFromHeaders, makeNativeHeaders, makeNativeHeadersFromCookieObject, mergeCookieObject } from "../src/runtime/utils"

const mockRuntimeConfig = (baseUrl = "https://example.com") => ({ public: { authJs: { baseUrl } } })

describe("all", () => {
  it("can transform cookie object into headers", () => {
    const cookies = { hello: "world", hi: "there" }
    const headers = makeNativeHeadersFromCookieObject(cookies)
    expect(headers.get("set-cookie")).toBe("hello=world, hi=there")
    expect(headers instanceof Headers).toBe(true)
  })

  it("can transform Request headers into native headers", () => {
    const headers = { hello: "world", hi: "there" }
    const nativeHeaders = makeNativeHeaders(headers)
    expect(nativeHeaders.get("hello")).toBe("world")
    expect(nativeHeaders.get("hi")).toBe("there")
    expect(nativeHeaders instanceof Headers).toBe(true)
  })

  it("can make cookies from cookie string", () => {
    const cookieString = "next-auth.hello=world; hi=there"
    const cookies = makeCookiesFromCookieString(cookieString)
    expect(cookies["next-auth.hello"]).toBe("world")
    expect(cookies.hi).toBeUndefined()
  })

  it("can make cookies from native headers", () => {
    const headers = new Headers()
    headers.append("set-cookie", "next-auth.hello=world")
    headers.append("set-cookie", "next-auth.hi=there")
    const cookies = makeCookiesFromHeaders(headers)
    expect(cookies["next-auth.hello"]).toBe("world")
    expect(cookies["next-auth.hi"]).toBe("there")
  })

  it("can handle splitted cookies from native headers", () => {
    const headers = new Headers()
    headers.append("set-cookie", "next-auth.greet.0=hello")
    headers.append("set-cookie", "next-auth.greet.1=world")
    headers.append("set-cookie", "hi=there")
    const cookies = makeCookiesFromHeaders(headers)
    const greet = mergeCookieObject(cookies, "next-auth.greet")
    expect(cookies["next-auth.greet.0"]).toBe("hello")
    expect(cookies["next-auth.greet.1"]).toBe("world")
    expect(greet).toBe("helloworld")
    expect(cookies.hi).toBeUndefined()
  })

  it("throws an error if the origin header is not set", () => {
    const url = "https://example.com"
    expect(() => checkOrigin(new Request(url, { method: "POST" }), mockRuntimeConfig(url)))
      .toThrowError("CSRF protected")
  })

  it("is undefined if the Origin is checked", () => {
    const url = "https://example.com"
    expect(checkOrigin(new Request(url, { method: "POST", headers: { Origin: url } }), mockRuntimeConfig(url)))
      .toBeUndefined()
  })
})
