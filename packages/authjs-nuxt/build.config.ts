import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: [
    "src/module"
  ],
  externals: [
    "@auth/core",
    "jose",
    "@panva/hkdf",
    "cookie-es",
    // implicit externals
    "h3",
    "ufo",
    "radix3",
    "destr",
    "uncrypto",
    "iron-webcrypto"
  ]
})
