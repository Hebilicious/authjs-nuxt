# ⚗️ AuthJS Nuxt

[![CI](https://github.com/Hebilicious/authjs-nuxt/actions/workflows/ci.yaml/badge.svg)](https://github.com/Hebilicious/authjs-nuxt/actions/workflows/ci.yaml)
[![npm version](https://badge.fury.io/js/@hebilicious%2Fauthjs-nuxt.svg)](https://badge.fury.io/js/@hebilicious%2Fauthjs-nuxt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🚀 Welcome to __AuthJS Nuxt__!  This is an edge compatible experimental Nuxt module currently in its alpha stage.
This module uses the [Auth.js](https://github.com/nextauthjs/next-auth) core implementation under the hood.
You can find the documentation [here](https://authjs-nuxt.pages.dev/) (WIP).
Contributions are welcome !

## ⚠️ Disclaimer

_🧪 This module like Auth.js, is still in developement._

### Why not?

1. **Why not use use [Sidebase Nuxt-Auth](https://github.com/sidebase/sidebase)?**

    - Because it's based on Next-Auth and not Auth.js.
    - Because it's not edge compatible. This module is.

2. **Why not use Auth.js directly?**
  
   - You can. However, Auth.js is currently being rewritten from Next-Auth, and wiring everything with Nuxt for the edge isn't straightforward. This gives you a good starting point and a reference implementation.

3. **Why should I use this package? I'd rather build my own auth!**

   - Auth.js gives you a good starting point, and has plenty of adapters and database drivers, and so does this package.
   - If you want to DIY even more, You can use something like [Lucia](https://github.com/pilcrowOnPaper/lucia).

### Why ?

- It's based on [Auth.js](https://github.com/nextauthjs/next-auth)
- It works everywhere (tested on the edge)
- It's lightweight
- It's Nuxt

## 📦 Installation

Install `@hebilicious/authjs-nuxt` and auth.js `@auth/core`  from npm :

```bash
npm i @hebilicious/authjs-nuxt @auth/core

pnpm i @hebilicious/authjs-nuxt @auth/core

yarn add @hebilicious/authjs-nuxt @auth/core
```

### Response support

Native `Response` is necessary for this module, and currently being added to Nuxt through h3 and nitropack.
Therefore you must enforce recent dependencies with your package manager :

```json
{
  "dependencies": {
    "@auth/core": "0.9.0",
    "h3": "1.8.0-rc.3",
    "nitropack": "npm:nitropack-edge@latest",
    "nuxt": "^3.6.5",
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
For environment variable usage with `runtimeConfig`, refer to the [Nuxt documentation](https://nuxt.com/docs/guide/going-further/runtime-config).

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

### Session and JWT

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

## 📦 Contributing

Contributions, issues and feature requests are welcome!

1. Fork this repo

2. Install `node` and `pnpm` _Use `corepack enable && corepack prepare pnpm@latest --activate` to install pnpm easily_

3. Use `pnpm i` at the mono-repo root.

4. Make modifications and follow conventional commits.

5. Open a PR 🚀🚀🚀
