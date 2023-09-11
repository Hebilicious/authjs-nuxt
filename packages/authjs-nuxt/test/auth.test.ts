import { describe, expect, it } from "vitest"
import { checkOrigin, makeCookiesFromCookieString, makeNativeHeadersFromCookieObject, noSurroundingSlash } from "../src/runtime/utils"

const mockRuntimeConfig = (serverUrl = "https://example.com") => ({ public: { authJs: { serverUrl } } })

describe("all", () => {
  it("can transform cookie object into headers", () => {
    const cookies = { hello: "world", hi: "there" }
    const headers = makeNativeHeadersFromCookieObject(cookies)
    expect(headers.get("set-cookie")).toBe("hello=world, hi=there")
    expect(headers instanceof Headers).toBe(true)
  })

  it("can make cookies from cookie string", () => {
    const cookieString = "next-auth.hello=world; hi=there"
    const cookies = makeCookiesFromCookieString(cookieString)
    expect(cookies["next-auth.hello"]).toBe("world")
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

  it("removes surrounding slashes", () => {
    expect(noSurroundingSlash("//hello//")).toBe("hello")
    expect(noSurroundingSlash("/hello/")).toBe("hello")

    expect(noSurroundingSlash("//hello")).toBe("hello")
    expect(noSurroundingSlash("/hello")).toBe("hello")

    expect(noSurroundingSlash("hello//")).toBe("hello")
    expect(noSurroundingSlash("hello/")).toBe("hello")

    expect(noSurroundingSlash("hello")).toBe("hello")
    expect(noSurroundingSlash("/")).toBe("")
  })
})
