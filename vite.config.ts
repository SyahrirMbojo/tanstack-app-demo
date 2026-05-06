import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";

// let devtools: any = null;
// if (process.env.NODE_ENV !== "production") {
//   try {
//     const mod = require("@tanstack/devtools-vite");
//     devtools = mod.devtools;
//   } catch {}
// }

// const config = defineConfig({
//   resolve: { tsconfigPaths: true },
//   // plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
//   plugins: [
//     ...(devtools ? [devtools()] : []),
//     tailwindcss(),
//     tanstackStart(),
//     viteReact(),
//     netlify(),
//   ],
// });

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), netlify(), tailwindcss(), tanstackStart(), viteReact()],
});

export default config;
