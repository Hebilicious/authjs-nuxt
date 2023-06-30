/* eslint-disable no-console */

import { copyFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import fg from "fast-glob"

const dir = fileURLToPath(new URL("..", import.meta.url))

const dts = await fg(resolve(dir, "dist/**/*.d.ts"))

// Create MTS and CTS files, see https://github.com/unjs/unbuild/issues/238 & https://github.com/gvergnaud/ts-pattern/pull/160
const dmts = dts.map(f => copyFileSync(f, f.replace(/\.d\.ts$/, ".d.mts"))) // should use .mjs extensions ?
const dcts = dts.map(f => copyFileSync(f, f.replace(/\.d\.ts$/, ".d.cts"))) // should use .cjs extensions ?

console.log(`Copied ${dmts.length} files from \`*.d.ts\` to \`*.d.mts\``)
console.log(`Copied ${dcts.length} files from \`*.d.ts\` to \`*.d.cts\``)
