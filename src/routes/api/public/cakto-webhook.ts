import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

const PIXEL_ID = "1301360554447433";
const GRAPH_VERSION = "v21.0";

const sha256 = (v?: string) =>
  v ? createHash("sha256").update(String(v).trim().toLowerCase()).digest("hex") : undefined;

function pick<T = any>(obj: any, paths: string[]): T | undefined {
  for (const p of paths) {
    const parts = p.split(".");
    let cur: any = obj;
    for (const k of parts) cur = cur?.[k];
    if (cur !== undefined && cur !== null && cur !== "") return cur as T;
  }
  return undefined;
}

export const Route = createFileRoute("/api/public/cakto-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const expected = process.env.CAKTO_WEBHOOK_SECRET;
        const provided =
          request.headers.get("x-cakto-secret") ||
          request.headers.get("x-webhook-secret") ||
          url.searchParams.get("secret");

        if (!expected || provided !== expected) {
          return new Response("unauthorized", { status: 401 });
        }

        let body: any = {};
        try {
          body = await request.json();
        } catch {
          return new Response("invalid json", { status: 400 });
        }

        // Determine event type (Cakto sends events like purchase_approved, transaction_paid, etc.)
        const eventType: string =
          pick(body, ["event", "type", "status", "data.status"]) || "";
        const isApproved = /approved|paid|completed|success|aprovad|pago/i.test(
          String(eventType),
        );

        if (!isApproved) {
          return Response.json({ ok: true, ignored: true, eventType });
        }

        // Extract transaction fields (try common Cakto/checkout shapes)
        const amountRaw =
          pick<number | string>(body, [
            "data.amount",
            "amount",
            "data.value",
            "value",
            "data.total",
            "total",
            "data.price",
            "price",
          ]) ?? 0;
        const value = typeof amountRaw === "number" ? amountRaw : parseFloat(String(amountRaw));
        const currency =
          pick<string>(body, ["data.currency", "currency"]) || "BRL";
        const transactionId =
          pick<string>(body, [
            "data.id",
            "id",
            "data.transaction_id",
            "transaction_id",
            "data.order_id",
            "order_id",
            "data.reference",
            "reference",
          ]) || `cakto_${Date.now()}`;

        const email = pick<string>(body, [
          "data.customer.email",
          "customer.email",
          "data.buyer.email",
          "buyer.email",
          "data.email",
          "email",
        ]);
        const phone = pick<string>(body, [
          "data.customer.phone",
          "customer.phone",
          "data.buyer.phone",
          "buyer.phone",
          "data.phone",
          "phone",
        ]);
        const fullName =
          pick<string>(body, [
            "data.customer.name",
            "customer.name",
            "data.buyer.name",
            "buyer.name",
            "data.name",
            "name",
          ]) || "";
        const [firstName, ...rest] = fullName.split(" ");
        const lastName = rest.join(" ");
        const city = pick<string>(body, ["data.customer.city", "customer.city"]);
        const zip = pick<string>(body, [
          "data.customer.zipcode",
          "customer.zipcode",
          "data.customer.zip",
          "customer.zip",
        ]);
        const country =
          pick<string>(body, ["data.customer.country", "customer.country"]) || "br";

        const fbp = pick<string>(body, ["data.fbp", "fbp", "data.tracking.fbp"]);
        const fbc = pick<string>(body, ["data.fbc", "fbc", "data.tracking.fbc"]);

        const token = process.env.FB_CAPI_TOKEN;
        if (!token) {
          console.error("[Cakto webhook] FB_CAPI_TOKEN missing");
          return Response.json({ ok: false, error: "missing_capi_token" }, { status: 500 });
        }

        const user_data: Record<string, any> = {
          em: email ? [sha256(email)] : undefined,
          ph: phone ? [sha256(String(phone).replace(/\D/g, ""))] : undefined,
          fn: firstName ? [sha256(firstName)] : undefined,
          ln: lastName ? [sha256(lastName)] : undefined,
          ct: city ? [sha256(city)] : undefined,
          zp: zip ? [sha256(zip)] : undefined,
          country: country ? [sha256(country)] : undefined,
          external_id: transactionId ? [sha256(transactionId)] : undefined,
          fbp,
          fbc,
        };
        Object.keys(user_data).forEach(
          (k) => user_data[k] === undefined && delete user_data[k],
        );

        const payload = {
          data: [
            {
              event_name: "Purchase",
              event_time: Math.floor(Date.now() / 1000),
              event_id: `purchase_${transactionId}`,
              event_source_url: "https://pay.cakto.com.br/3a9ynm4_396700",
              action_source: "website",
              user_data,
              custom_data: {
                currency,
                value: Number.isFinite(value) ? value : 39.9,
                content_ids: ["3a9ynm4_396700"],
                content_type: "product",
                order_id: transactionId,
              },
            },
          ],
        };

        try {
          const res = await fetch(
            `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${token}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            },
          );
          if (!res.ok) {
            const txt = await res.text();
            console.error("[Cakto webhook] CAPI error", res.status, txt);
            return Response.json(
              { ok: false, error: "graph_error", status: res.status },
              { status: 502 },
            );
          }
          return Response.json({ ok: true, transactionId, value, currency });
        } catch (e) {
          console.error("[Cakto webhook] network error", e);
          return Response.json({ ok: false, error: "network" }, { status: 502 });
        }
      },
      GET: async () => new Response("ok", { status: 200 }),
    },
  },
});
