# ⚗️ AuthJS Nuxt

[![CI](https://github.com/Hebilicious/authjs-nuxt/actions/workflows/ci.yaml/badge.svg)](https://github.com/Hebilicious/authjs-nuxt/actions/workflows/ci.yaml)
[![npm version](https://badge.fury.io/js/@hebilicious%2Fauthjs-nuxt.svg)](https://badge.fury.io/js/@hebilicious%2Fauthjs-nuxt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🚀 Welcome to __AuthJS Nuxt__!  This is an edge compatible experimental Nuxt module currently in its alpha stage.
This module uses the [Auth.js](https://github.com/nextauthjs/next-auth) core implementation under the hood.

## ⚠️ Disclaimer

_🧪 This module like Auth.js, is still in developement._
Contributions are welcome !

## Documentation

You can find the documentation [here](https://authjs-nuxt.pages.dev/) (WIP).

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

2. Install `node` and `pnpm` _Use `corepack enable && corepack prepare pnpm@latest --activate` to install pnpm easily_

3. Use `pnpm i` at the mono-repo root.

4. Make modifications and follow conventional commits.

5. Open a PR 🚀🚀🚀
