import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: [
    "src/module"
  ],
  externals: [
    // Should be installed by the user
    "@auth/core",
    // Should be installed by the module
    // "jose",
    // "@panva/hkdf",
    // "cookie-es",
    // Should be implicitly externals
    "h3",
    "ufo",
    "radix3",
    "destr",
    "uncrypto",
    "iron-webcrypto"
  ],
  declaration: true,
  rollup: {
    emitCJS: true
  }
})
