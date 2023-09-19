# Nuxt Configuration

## ⚙️ Nuxt settings

Add the module to your `nuxt.config.ts` file, and provider specfic settings.
Refer to the [examples](https://github.com/Hebilicious/authjs-nuxt-examples) for more details.

```ts
export default defineNuxtConfig({
  modules: ["@hebilicious/authjs-nuxt"],
  // Optional default config
  //  authJs: {
  //    verifyClientOnEveryRequest: true,
  //    guestRedirectTo: "/", // where to redirect if the user is not authenticated
  //    authenticatedRedirectTo: "/", // where to redirect if the user is authenticated
  //    baseUrl: "" // should be something like https://www.my-app.com
  //  },
  runtimeConfig: {
    authJs: {
      secret: process.env.NUXT_NEXTAUTH_SECRET // You can generate one with `openssl rand -base64 32`
    },
    github: {
      clientId: process.env.NUXT_GITHUB_CLIENT_ID,
      clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET
    },
    public: {
      authJs: {
        baseUrl: process.env.NUXT_NEXTAUTH_URL, // The URL of your deployed app (used for origin Check in production)
        verifyClientOnEveryRequest: true // whether to hit the /auth/session endpoint on every client request
      }
    }
  }
})
```

## 🛠️ Route Configuration

You *must* create a catch-all route at `server/api/auth/[...].ts`.

```ts
import GithubProvider from "@auth/core/providers/github"
import type { AuthConfig } from "@auth/core/types"
import { NuxtAuthHandler } from "#auth"

// The #auth virtual import comes from this module. You can use it on the client
// and server side, however not every export is universal. For example do not
// use sign-in and sign-out on the server side.

const runtimeConfig = useRuntimeConfig()

// Refer to Auth.js docs for more details
export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  providers: [
    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret
    })
  ]
}

export default NuxtAuthHandler(authOptions, runtimeConfig)
// If you don't want to pass the full runtime config,
//  you can pass something like this: { public: { authJs: { baseUrl: "" } } }
```

### Environment variables

You do not need to specify the environment variables in the `nuxt.config.ts`, because environment variables prefixed by `NUXT_` will apply automatically.
For example, `NUXT_GITHUB_CLIENT_ID` will replace the value defined under `runtimeConfig.github.clientId`.

For `.env` and general environment variable usage with `runtimeConfig`, refer to the [Nuxt documentation](https://nuxt.com/docs/guide/going-further/runtime-config).

For production, you *must* set a baseUrl that matches the url where your app is deployed. This will protect your users against `CSRF` attacks.
