#!/usr/bin/env node
// Guards against the white-screen regression: stray browserslist files in
// project root, missing build scripts, or vite config that fails to load.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const errors = [];

// 1. No stray browserslist files in project root (they crash Vite).
for (const name of ["browserslist", "browserslist.cmd", "browserslist.ps1", ".browserslistrc"]) {
  if (existsSync(resolve(root, name))) {
    errors.push(`Stray ${name} found in project root — delete it (use "browserslist" field in package.json instead).`);
  }
}

// 2. package.json must expose dev/build/build:dev.
const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
for (const s of ["dev", "build", "build:dev"]) {
  if (!pkg.scripts?.[s]) errors.push(`Missing "${s}" script in package.json`);
}

// 3. vite.config must exist and parse.
if (!existsSync(resolve(root, "vite.config.ts")) && !existsSync(resolve(root, "vite.config.js"))) {
  errors.push("vite.config.{ts,js} not found");
}

if (errors.length) {
  console.error("✗ Config check failed:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("✓ Config check passed");
