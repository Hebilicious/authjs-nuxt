# 💻 Usage

## 📝 Pages and components

In your pages and vue files, use the `useAuth` helper to handle your authentication.

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

## 🌉 Middlewares

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

There is 3 middlewares availables :

```ts
definePageMeta({ middleware: "auth" })
definePageMeta({ middleware: "client-auth" }) // will run globally with `verifyClientOnEveryRequest: true`
definePageMeta({ middleware: "guest-only" }) // will redirect to `guestRedirectTo` if the user is authenticated
```

Use `definePageMeta({ middleware: "auth" })` and `verifyClientOnEveryRequest: true` to protect pages while doing client side routing.

You can register manually with `definePageMeta({ middleware: "client-auth" })` if you want to disable `verifyClientOnEveryRequest` in the config.

You can configure `guestRedirectTo` and `authenticatedRedirectTo` globally, or in the middleware with the `auth` key which takes priority.

## 🔐 Session and JWT

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

## 🎱 Extending Auth.js Types

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
