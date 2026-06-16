import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

const PIXEL_ID = "1301360554447433";
const GRAPH_VERSION = "v21.0";

const sha256 = (v?: string | null) =>
  v ? createHash("sha256").update(String(v).trim().toLowerCase()).digest("hex") : undefined;

export const Route = createFileRoute("/api/public/cakto-webhook")({
  server: {
    handlers: {
      GET: async () => new Response("ok", { status: 200 }),
      POST: async ({ request }) => {
        const url = new URL(request.url);

        let body: any = {};
        try {
          body = await request.json();
        } catch {
          return new Response("invalid json", { status: 400 });
        }

        // Cakto sends: { event, secret, data: {...} }
        const expected = process.env.CAKTO_WEBHOOK_SECRET;
        const provided =
          body?.secret ||
          request.headers.get("x-cakto-secret") ||
          request.headers.get("x-webhook-secret") ||
          url.searchParams.get("secret");

        if (!expected || provided !== expected) {
          console.warn("[Cakto webhook] unauthorized", { hasExpected: !!expected });
          return new Response("unauthorized", { status: 401 });
        }

        const event: string = String(body?.event || "");
        const data = body?.data ?? {};
        const status: string = String(data?.status || "");

        // Cakto approved events: purchase_approved, subscription_renewed, etc.
        // status === "paid" indicates the transaction is settled.
        const isApproved =
          /purchase_approved|subscription_(?:created|renewed)|payment_approved/i.test(event) ||
          /^(paid|approved|completed)$/i.test(status);

        if (!isApproved) {
          return Response.json({ ok: true, ignored: true, event, status });
        }

        // --- Extract real fields per Cakto schema ---
        const amountRaw = data.amount ?? data.baseAmount ?? data.offer?.price ?? 0;
        const value =
          typeof amountRaw === "number" ? amountRaw : parseFloat(String(amountRaw)) || 0;
        const currency: string = (data.currency || "BRL").toUpperCase();
        const transactionId: string =
          data.id || data.refId || `cakto_${Date.now()}`;

        const customer = data.customer ?? {};
        const address = data.address ?? {};
        const offer = data.offer ?? {};
        const product = data.product ?? {};

        const email: string | undefined = customer.email || undefined;
        const phoneDigits = customer.phone
          ? String(customer.phone).replace(/\D/g, "")
          : undefined;
        const fullName: string = String(customer.name || "").trim();
        const [firstName, ...rest] = fullName.split(/\s+/);
        const lastName = rest.join(" ");

        const city: string | undefined = address.city || undefined;
        const zip: string | undefined = address.zipcode || address.zip || undefined;
        const country: string = (address.country || "br").toLowerCase();

        const fbp: string | undefined = data.fbp || undefined;
        const fbc: string | undefined = data.fbc || undefined;

        const token = process.env.FB_CAPI_TOKEN;
        if (!token) {
          console.error("[Cakto webhook] FB_CAPI_TOKEN missing");
          return Response.json({ ok: false, error: "missing_capi_token" }, { status: 500 });
        }

        const user_data: Record<string, any> = {
          em: email ? [sha256(email)] : undefined,
          ph: phoneDigits ? [sha256(phoneDigits)] : undefined,
          fn: firstName ? [sha256(firstName)] : undefined,
          ln: lastName ? [sha256(lastName)] : undefined,
          ct: city ? [sha256(city)] : undefined,
          zp: zip ? [sha256(zip)] : undefined,
          country: country ? [sha256(country)] : undefined,
          external_id: customer.docNumber
            ? [sha256(String(customer.docNumber))]
            : transactionId
              ? [sha256(transactionId)]
              : undefined,
          fbp,
          fbc,
        };
        Object.keys(user_data).forEach(
          (k) => user_data[k] === undefined && delete user_data[k],
        );

        const contentId =
          offer.id || product.short_id || product.id || "3a9ynm4_396700";

        const payload = {
          data: [
            {
              event_name: "Purchase",
              event_time: Math.floor(Date.now() / 1000),
              event_id: `purchase_${transactionId}`,
              event_source_url:
                data.checkoutUrl || "https://pay.cakto.com.br/3a9ynm4_396700",
              action_source: "website",
              user_data,
              custom_data: {
                currency,
                value,
                content_ids: [contentId],
                content_name: offer.name || product.name || undefined,
                content_type: "product",
                order_id: transactionId,
                payment_method: data.paymentMethod || undefined,
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
              { ok: false, error: "graph_error", status: res.status, detail: txt },
              { status: 502 },
            );
          }
          console.log("[Cakto webhook] Purchase sent", {
            transactionId,
            value,
            currency,
            email: !!email,
            phone: !!phoneDigits,
          });
          return Response.json({ ok: true, transactionId, value, currency });
        } catch (e) {
          console.error("[Cakto webhook] network error", e);
          return Response.json({ ok: false, error: "network" }, { status: 502 });
        }
      },
    },
  },
});
