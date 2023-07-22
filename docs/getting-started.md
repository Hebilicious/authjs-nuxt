# Getting started

## 📦 Installation

Install `@hebilicious/authjs-nuxt` and auth.js `@auth/core`  from npm :

```bash
npm i @hebilicious/authjs-nuxt @auth/core

pnpm i @hebilicious/authjs-nuxt @auth/core

yarn add @hebilicious/authjs-nuxt @auth/core
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
   //    guestRedirectTo: "/",
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

Note that you can use whatever environment variables you want here, this is just an example.

### Import errors

You might run into imports errors for cookie or for the @auth/core internals. 
Add these aliases if you are running into import errors

```ts
import { resolve } from "node:path"

export default defineNuxtConfig({
  alias: {
    "cookie": resolve(__dirname, "node_modules/cookie"),
    "jose": resolve(__dirname, "node_modules/jose/dist/browser/index.js"),
    "@panva/hkdf": resolve(__dirname, "node_modules/@panva/hkdf/dist/web/index.js")
  }
})
```

## 📝 Usage

Use the `useAuth` helper to handle your authentication.

```html
<script setup lang="ts">
const { signIn, signOut, session, status, cookies } = useAuth()
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

## 📝 Middlewares

Use middlewares to protect your pages.

`pages/private.vue`

```html
<script>
definePageMeta({ middleware: "auth" })
</script>

<template>
  <h1>PRIVATE</h1>
</template>
```

There's 2 middlewares availables :

```ts
definePageMeta({ middleware: "auth" })
definePageMeta({ middleware: "client-auth" }) // will run globally with `verifyClientOnEveryRequest: true`
```

Use `definePageMeta({ middleware: "auth" })` and `verifyClientOnEveryRequest: true` to protect pages while doing client side routing.
Yo can register manually with `definePageMeta({ middleware: "client-auth" })` if you want to disable `verifyClientOnEveryRequest` in the config.

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
