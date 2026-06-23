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

// 4. Required runtime secrets / endpoints (CAKTO + EmailOctopus).
const REQUIRED_SECRETS = [
  "CAKTO_CLIENT_ID",
  "CAKTO_CLIENT_SECRET",
  "CAKTO_WEBHOOK_SECRET",
  "EMAILOCTOPUS_API_KEY",
];
const REQUIRED_ENDPOINTS = {
  CAKTO_CHECKOUT_URL: process.env.CAKTO_CHECKOUT_URL ?? "https://pay.cakto.com.br/3a9ynm4_396700",
  EMAILOCTOPUS_API_BASE: process.env.EMAILOCTOPUS_API_BASE ?? "https://emailoctopus.com/api/1.6",
};

const missingSecrets = REQUIRED_SECRETS.filter((k) => !process.env[k]);
const strict = process.env.CI === "true" || process.env.STRICT_CONFIG_CHECK === "true";

if (missingSecrets.length) {
  const msg = `Missing required secrets: ${missingSecrets.join(", ")}`;
  if (strict) errors.push(msg);
  else console.warn("⚠ " + msg + " (configure in Lovable Cloud → Secrets)");
}

for (const [name, url] of Object.entries(REQUIRED_ENDPOINTS)) {
  try {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) throw new Error("not http(s)");
  } catch {
    errors.push(`Invalid endpoint ${name}: "${url}"`);
  }
}

if (errors.length) {
  console.error("✗ Config check failed:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("✓ Config check passed");
console.log(`  endpoints ok: ${Object.keys(REQUIRED_ENDPOINTS).join(", ")}`);
console.log(`  secrets present: ${REQUIRED_SECRETS.filter((k) => process.env[k]).length}/${REQUIRED_SECRETS.length}`);
