import crypto from "node:crypto";
import { seenBefore } from "./_lib/dedup";

// Vercel Serverless Function — Node runtime
export const config = { runtime: "nodejs" };

const ALLOWED_EVENTS = new Set([
  "boleto_gerado",
  "pix_gerado",
  "purchase_approved",
  "purchase_refused",
  "refund",
  "chargeback",
  "checkout_abandonment",
  "picpay_gerado",
  "openfinance_nubank_gerado",
]);

function timingSafeEqualHex(a: string, b: string) {
  try {
    const ab = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (ab.length === 0 || ab.length !== bb.length) return false;
    return crypto.timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}

function timingSafeEqualStr(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

async function readRawBody(req: any): Promise<string> {
  if (typeof req.body === "string") return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const secret = process.env.CAKTO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[cakto-webhook] missing CAKTO_WEBHOOK_SECRET");
    return res.status(500).json({ error: "server_misconfigured" });
  }

  const raw = await readRawBody(req);

  // Cakto pode enviar a assinatura em diferentes headers — aceitamos os comuns.
  const headerSig = String(
    req.headers["x-cakto-signature"] ||
      req.headers["x-webhook-signature"] ||
      req.headers["x-signature"] ||
      req.headers["cakto-signature"] ||
      ""
  ).trim();

  if (!headerSig) {
    return res.status(401).json({ error: "missing_signature" });
  }

  // Computa HMAC-SHA256(body) com o segredo.
  const computedHex = crypto.createHmac("sha256", secret).update(raw).digest("hex");

  // Aceita formatos: "<hex>", "sha256=<hex>" ou o segredo cru (fallback simples da Cakto).
  const sig = headerSig.replace(/^sha256=/i, "");
  const valid =
    timingSafeEqualHex(sig, computedHex) || timingSafeEqualStr(headerSig, secret);

  if (!valid) {
    console.warn("[cakto-webhook] invalid signature");
    return res.status(401).json({ error: "invalid_signature" });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return res.status(400).json({ error: "invalid_json" });
  }

  const event = String(payload?.event || payload?.type || "").trim();
  if (!event || !ALLOWED_EVENTS.has(event)) {
    return res.status(422).json({ error: "unsupported_event", event });
  }

  // Idempotência: usa delivery/event id do header ou do payload.
  const deliveryId = String(
    req.headers["x-cakto-delivery-id"] ||
      req.headers["x-delivery-id"] ||
      req.headers["x-event-id"] ||
      payload?.delivery_id ||
      payload?.id ||
      ""
  ).trim();

  if (!deliveryId) {
    // Fallback: hash do corpo para evitar duplicatas exatas.
    const bodyHash = crypto.createHash("sha256").update(raw).digest("hex");
    if (seenBefore(`body:${bodyHash}`)) {
      return res.status(200).json({ received: true, duplicate: true, event });
    }
  } else if (seenBefore(`id:${deliveryId}`)) {
    console.log("[cakto-webhook] duplicate ignored", { event, deliveryId });
    return res.status(200).json({ received: true, duplicate: true, event, deliveryId });
  }

  // TODO: persistir/encaminhar o evento conforme a regra de negócio.
  console.log("[cakto-webhook] accepted", { event, id: deliveryId || payload?.id || null });

  return res.status(200).json({ received: true, event, deliveryId: deliveryId || null });
}
