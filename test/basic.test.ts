import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { $fetch, setup } from "@nuxt/test-utils"

describe("basic test", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/basic", import.meta.url))
  })

  it("displays data", async () => {
    const html = await $fetch("/")
    expect(html).toContain("Sign In")
  })
})
