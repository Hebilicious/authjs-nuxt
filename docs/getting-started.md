# Getting started

## 📦 Installation

Install `@hebilicious/authjs-nuxt` and auth.js `@auth/core`  from npm :

```bash
npm i @hebilicious/authjs-nuxt @auth/core

pnpm i @hebilicious/authjs-nuxt @auth/core

yarn add @hebilicious/authjs-nuxt @auth/core
```

### Response support

Auth.js relies on native `Response` support, which is currently being added to Nuxt through [h3](https://github.com/unjs/h3) and [nitro](https://github.com/unjs/nitro).
Therefore you must enforce recent dependencies with your package manager :

```json
{
  "dependencies": {
    "@auth/core": "0.9.0",
    "h3": "1.8.0-rc.3", // 1.8.0 or above
    "nitropack": "npm:nitropack-edge@latest", // 2.6.0 or above
    "nuxt": "^3.6.5", // 3.6.5 or above
    "@hebilicious/authjs-nuxt": "0.2.0-beta.8"
  },
  "overrides": { // for npm
    "h3": "1.8.0-rc.3",
    "nitropack": "npm:nitropack-edge@latest"
  },
  "resolutions": { // for pnpm and yarn
    "h3": "1.8.0-rc.3",
    "nitropack": "npm:nitropack-edge@latest"
  }
}
```

## 🛠️ Route Configuration

Create a catch-all route at `server/api/auth/[...].ts`.

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

## ⚙️ Nuxt settings

This is an example for GitHub

 ```ts
export default defineNuxtConfig({
   modules: ["@hebilicious/authjs-nuxt"],
   // Optional default config
   //  authJs: {
   //    verifyClientOnEveryRequest: true,
   //    guestRedirectTo: "/", // where to redirect if the user is authenticated
   //    authenticatedRedirectTo: "/", // where to redirect if the user is not authenticated
   //    baseUrl: ""
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
         baseUrl: process.env.NUXT_NEXTAUTH_URL, // The base URL is used for the Origin Check in prod only
         verifyClientOnEveryRequest: true // whether to hit the /auth/session endpoint on every client request
       }
     }
   }
})
  ```

Note that you can use whatever environment variables prefixed by `NUXT_` you want here, this is just an example.
For `.env` and general environment variable usage with `runtimeConfig`, refer to the [Nuxt documentation](https://nuxt.com/docs/guide/going-further/runtime-config).

For production, you *must* set a baseUrl that matches the url where your app is deployed. This will protect your users against `CSRF` attacks.

### Import errors

You might run into imports errors for cookie or for the @auth/core internals.
Uses aliases if you are running into import errors.

```ts
import { resolve } from "node:path"

export default defineNuxtConfig({
  alias: {
    cookie: resolve(__dirname, "node_modules/cookie")
  }
})
```

## 📝 Usage

Use the `useAuth` helper to handle your authentication.

```html
<script setup lang="ts">
const { signIn, signOut, session, status, cookies, getProviders } = useAuth()
</script>

<template>
  <div>
    <div>
      <a href="/api/auth/signin" class="buttonPrimary">Native Link Sign in</a>
      <button @click="signIn(`github`)">
        JS Sign In
      </button>
      <button @click="signOut()">
        Sign Out
      </button>
    </div>
    <div>
      <pre>{{ status }}</pre>
      <pre>{{ session?.user }}</pre>
      <pre>{{ cookies }}</pre>
    </div>
  </div>
</template>
```

### Extending Auth.js Types

If you need to extend Auth.js types such as `Session` or `User`, create a Typescript declaration file (`types.d.ts`) in your project root.

```ts
declare module "@auth/core/types" {
  interface Session {
    user?: User
  }
  interface User {
    role: string
  }
}

export {}
```

## 📝 Middlewares

Use middlewares to protect your pages.

`pages/private.vue`

```html
<script>
definePageMeta({ middleware: "auth", auth: { guestRedirectTo: "/login" } })
</script>

<template>
  <h1>PRIVATE</h1>
</template>
```

`pages/login.vue`

```html
<script>
definePageMeta({ middleware: "guest-only", auth: { authenticatedRedirectTo: "/profile" } })
</script>

<template>
  <h1>Login</h1>
</template>
```

There's 3 middlewares availables :

```ts
definePageMeta({ middleware: "auth" })
definePageMeta({ middleware: "client-auth" }) // will run globally with `verifyClientOnEveryRequest: true`
definePageMeta({ middleware: "guest-only" }) // will redirect to `guestRedirectTo` if the user is authenticated
```

Use `definePageMeta({ middleware: "auth" })` and `verifyClientOnEveryRequest: true` to protect pages while doing client side routing.
You can register manually with `definePageMeta({ middleware: "client-auth" })` if you want to disable `verifyClientOnEveryRequest` in the config.
You can configure `guestRedirectTo` and `authenticatedRedirectTo` globally, or in the middleware with the `auth` key which takes priority.

## Session and JWT

If you need the session or the JWT on your api handlers, use the following methods :

```ts
import { authOptions } from "./auth/[...]"
import { getServerSession, getServerToken } from "#auth"

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions)
  const jwt = await getServerToken(event, authOptions)
  return { session, jwt }
})
```
