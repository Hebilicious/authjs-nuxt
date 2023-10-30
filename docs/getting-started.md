# Getting started

## 📦 Installation

Install `@hebilicious/authjs-nuxt` and auth.js `@auth/core`  from npm :

```bash
npm i @hebilicious/authjs-nuxt @auth/core

bun i @hebilicious/authjs-nuxt @auth/core

pnpm i @hebilicious/authjs-nuxt @auth/core

yarn add @hebilicious/authjs-nuxt @auth/core
```

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

#### pnpm

```ts
export default defineNuxtConfig({
  alias: {
    cookie: "cookie"
  }
})
```

### Response support

Auth.js relies on native `Response` support, which is currently being added to Nuxt through [h3](https://github.com/unjs/h3) and [nitro](https://github.com/unjs/nitro).
Therefore you must use a recent version of Nuxt (3.6.5 or above).
