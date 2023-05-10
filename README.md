# ⚗️ AuthJS Nuxt: Experimental Module

Welcome to AuthJS Nuxt! This is an experimental module currently in its alpha stage, strictly adhering to the Auth.js core implementation. 

## 📦 Installation

```bash
pnpm i @hebilicious/authjs-nuxt
```

##  Caution

This module is intended for those who know their way around authentication processes and are comfortable navigating potential breaking changes. We're constantly tinkering, improving, and yes, sometimes breaking things. But that's the nature of innovation!

## 🛠️ How to Use

1. Create a catch-all route at `server/api/auth/[...].ts`. 

```ts
import GithubProvider from "@auth/core/providers/github"
import type { AuthConfig } from "@auth/core/types"
import { NuxtAuthHandler } from "~/modules/auth-nuxt/runtime/lib"

const runtimeConfig = useRuntimeConfig()

export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  providers: [
    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret
    })
  ]
}

export default NuxtAuthHandler(authOptions)
```

2. Configure your Nuxt settings as shown below:

```ts
export default defineConfig({
  runtimeConfig: {
    authJs: {
      secret: process.env.NUXT_NEXTAUTH_SECRET
    },
    github: {
      clientId: process.env.NUXT_GITHUB_CLIENT_ID,
      clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET
    },
    public: {
      authJs: {
        baseUrl: process.env.NUXT_NEXTAUTH_URL // The base URL is used for the Origin Check
      }
    }
  }
})
```

Remember: this is an alpha
Use with caution! 🏇


