import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { $fetch, setup } from "@nuxt/test-utils"
import { createPage } from "@nuxt/test-utils/e2e"

describe("custom base path test", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/custom-base-path", import.meta.url))
  })

  it("displays homepage", async () => {
    const html = await $fetch("/")
    expect(html).toContain("Sign In")
  })

  it("displays signin page", async () => {
    const page = await $fetch("/custom/auth/signin")
    expect(page).toContain("Username")
    expect(page).toContain("Password")
  })

  it("fetches auth providers", async () => {
    const json = await $fetch("/custom/auth/providers")
    expect(json).toMatchObject(expect.objectContaining({
      credentials: expect.objectContaining({
        id: "credentials",
        name: "Credentials",
        type: "credentials",
        signinUrl: expect.stringMatching(/\/custom\/auth\/signin\/credentials$/),
        callbackUrl: expect.stringMatching(/\/custom\/auth\/callback\/credentials$/)
      })
    }))
  })

  // @todo: requires install playwright-core
  it.skip("can signin", async () => {
    const page = await createPage("/custom/auth/signin")
    expect(await page.title()).toBe("Sign In")

    await page.getByLabel("Username").fill("admin")
    await page.getByLabel("Password").fill("admin")
    await page.locator("#submitButton").click()

    expect(await page.getByText("authenticated")).toBeTruthy()
  })
})
