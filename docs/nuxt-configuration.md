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
  //    guestRedirectTo: "/", // where to redirect if the user is authenticated
  //    authenticatedRedirectTo: "/", // where to redirect if the user is not authenticated
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
        serverUrl: process.env.NUXT_NEXTAUTH_URL, // The URL of your deployed app (used for origin Check in production)
        verifyClientOnEveryRequest: true // whether to hit the /auth/session endpoint on every client request
      }
    }
  }
})
```

### Import errors

You might run into imports errors for cookie. Uses the following config to fix them.

```ts
import { resolve } from "node:path"

export default defineNuxtConfig({
  alias: {
    cookie: resolve(__dirname, "node_modules/cookie")
  }
})
```

## 🛠️ Route Configuration

You *must* create a catch-all route at `server/api/auth/[...].ts`.
Please use the `defineAuthJsConfig` to make sure Auth.js is configured correctly with Nuxt.

```ts
import GithubProvider from "@auth/core/providers/github"

const runtimeConfig = useRuntimeConfig()

// Refer to Auth.js docs for more details
export const authOptions = defineAuthJsConfig({
  secret: runtimeConfig.authJs.secret,
  providers: [
    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret
    })
  ]
})

export default NuxtAuthJsHandler(authOptions, runtimeConfig)
// If you don't want to pass the full runtime config,
//  you can trim the un-needed keys: `{ public: { authJs: { baseUrl: "" } } }`
```

While you can use both `runtimeConfig.authJs` and `runtimeConfig.public.authJs`, you should place sensitive values in `runtimeConfig.authJs`.

### Environment variables

You do not need to specify the environment variables in the `nuxt.config.ts`, because environment variables prefixed by `NUXT_` will apply automatically.
For example, `NUXT_GITHUB_CLIENT_ID` will replace the value defined under `runtimeConfig.github.clientId`.

For `.env` and general environment variable usage with `runtimeConfig`, refer to the [Nuxt documentation](https://nuxt.com/docs/guide/going-further/runtime-config).

For production, you *must* set a baseUrl that matches the url where your app is deployed. This will protect your users against `CSRF` attacks.
