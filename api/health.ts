export const config = { runtime: "nodejs" };

import { dedupStats } from "./_lib/dedup";

export default function handler(_req: any, res: any) {
  const hasSecret = Boolean(process.env.CAKTO_WEBHOOK_SECRET);
  const hasClientId = Boolean(process.env.CAKTO_CLIENT_ID);
  const hasClientSecret = Boolean(process.env.CAKTO_CLIENT_SECRET);
  const hasEmailOctopus = Boolean(process.env.EMAILOCTOPUS_API_KEY);

  const checks = {
    cakto_webhook_secret: hasSecret,
    cakto_client_id: hasClientId,
    cakto_client_secret: hasClientSecret,
    emailoctopus_api_key: hasEmailOctopus,
  };

  const ok = hasSecret; // webhook secret é o mínimo crítico
  res.setHeader("Cache-Control", "no-store");
  return res.status(ok ? 200 : 503).json({
    status: ok ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptimeSec: Math.round(process.uptime?.() ?? 0),
    checks,
    dedup: dedupStats(),
  });
}
