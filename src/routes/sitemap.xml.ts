// Sitemap era gerado server-side (SSR).
// No modo SPA (Vite), o sitemap está em /public/sitemap.xml como arquivo estático.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap/xml")({
  component: () => null,
});