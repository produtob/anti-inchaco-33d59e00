import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { createHash } from "crypto";
import { z } from "zod";

const PIXEL_ID = "1301360554447433";
const GRAPH_VERSION = "v21.0";

const inputSchema = z.object({
  event_name: z.string(),
  event_id: z.string(),
  event_source_url: z.string().url(),
  custom_data: z.record(z.string(), z.any()).optional(),
  user_data: z
    .object({
      email: z.string().optional(),
      phone: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      zip: z.string().optional(),
      external_id: z.string().optional(),
    })
    .optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
});

const sha256 = (v?: string) =>
  v ? createHash("sha256").update(v.trim().toLowerCase()).digest("hex") : undefined;

export const sendCapiEvent = createServerFn({ method: "POST" })
  .inputValidator((d) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    const token = process.env.FB_CAPI_TOKEN;
    if (!token) return { ok: false, error: "missing_token" };

    const ua = getRequestHeader("user-agent") ?? undefined;
    const xff = getRequestHeader("x-forwarded-for") ?? "";
    const cfIp = getRequestHeader("cf-connecting-ip") ?? "";
    const ip = (cfIp || xff.split(",")[0] || "").trim() || undefined;

    const u = data.user_data ?? {};
    const user_data: Record<string, any> = {
      client_user_agent: ua,
      client_ip_address: ip,
      fbp: data.fbp,
      fbc: data.fbc,
      em: u.email ? [sha256(u.email)] : undefined,
      ph: u.phone ? [sha256(u.phone.replace(/\D/g, ""))] : undefined,
      fn: u.first_name ? [sha256(u.first_name)] : undefined,
      ln: u.last_name ? [sha256(u.last_name)] : undefined,
      ct: u.city ? [sha256(u.city)] : undefined,
      country: u.country ? [sha256(u.country)] : undefined,
      zp: u.zip ? [sha256(u.zip)] : undefined,
      external_id: u.external_id ? [sha256(u.external_id)] : undefined,
    };
    Object.keys(user_data).forEach((k) => user_data[k] === undefined && delete user_data[k]);

    const payload = {
      data: [
        {
          event_name: data.event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: data.event_id,
          event_source_url: data.event_source_url,
          action_source: "website",
          user_data,
          custom_data: data.custom_data ?? {},
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
        const body = await res.text();
        console.error("[CAPI] error", res.status, body);
        return { ok: false, error: "graph_error" };
      }
      return { ok: true };
    } catch (e) {
      console.error("[CAPI] exception", e);
      return { ok: false, error: "network" };
    }
  });
