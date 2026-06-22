// Este endpoint de webhook era server-side (SSR).
// No modo SPA (Vite), chamadas de webhook devem ser feitas via
// uma função Vercel separada ou serviço externo.
// Mantemos a rota declarada para não quebrar o routeTree.gen.ts.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/cakto-webhook")({
  component: () => null,
});
