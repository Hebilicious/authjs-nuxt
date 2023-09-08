# ⚗️ AuthJS Nuxt

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![CI](https://github.com/Hebilicious/authjs-nuxt/actions/workflows/ci.yaml/badge.svg)](https://github.com/Hebilicious/authjs-nuxt/actions/workflows/ci.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[npm-version-src]: https://img.shields.io/npm/v/@hebilicious/authjs-nuxt
[npm-version-href]: https://npmjs.com/package/@hebilicious/authjs-nuxt
[npm-downloads-src]: https://img.shields.io/npm/dm/@hebilicious/authjs-nuxt
[npm-downloads-href]: https://npmjs.com/package/@hebilicious/authjs-nuxt

🚀 Welcome to __AuthJS Nuxt__!  This is an edge compatible experimental Nuxt module currently in its alpha stage.
This module uses the [Auth.js](https://github.com/nextauthjs/next-auth) core implementation under the hood.

## ⚠️ Disclaimer

_🧪 This module like Auth.js, is still in developement._
Contributions are welcome !

## Documentation

You can find the documentation for this module [on the website](https://authjs-nuxt.pages.dev/); and the documentation for auth.js [here](https://authjs.dev/).
You can also find working examples of this module in the playgrounds, on in this [repository](https://github.com/Hebilicious/authjs-nuxt-examples).

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

## 📦 Contributing

Contributions, issues and feature requests are welcome!

1. Fork this repo

2. [Install `bun`.](https://bun.sh/docs/installation)

3. Use `bun i` at the mono-repo root.

4. Make modifications and follow conventional commits.

5. Open a PR 🚀🚀🚀
