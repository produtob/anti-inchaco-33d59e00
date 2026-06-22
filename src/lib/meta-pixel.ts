// Client-side Meta Pixel helpers + server-side CAPI dedup trigger.
// import { sendCapiEvent } from "./meta-capi.functions";

export const FB_PIXEL_ID = "1301360554447433";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

type PixelParamValue = string | number | boolean | null | undefined | string[];
type PixelParams = Record<string, PixelParamValue>;

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "evt_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getFbp(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(/(?:^|; )_fbp=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : undefined;
}

function getFbc(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(/(?:^|; )_fbc=([^;]+)/);
  if (m) return decodeURIComponent(m[1]);
  // build from fbclid if present
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid");
  if (fbclid) {
    const fbc = `fb.1.${Date.now()}.${fbclid}`;
    document.cookie = `_fbc=${fbc}; path=/; max-age=${60 * 60 * 24 * 90}`;
    return fbc;
  }
  return undefined;
}

export function trackEvent(
  eventName: string,
  params: PixelParams = {},
) {
  if (typeof window === "undefined") return;
  const eventId = uuid();
  // Browser pixel
  try {
    window.fbq?.("track", eventName, params, { eventID: eventId });
  } catch (error) {
    if (import.meta.env.DEV) console.warn("Meta Pixel event failed", error);
  }
  // Server-side CAPI (deduped via event_id)
  // try {
  //   void sendCapiEvent({
  //     data: {
  //       event_name: eventName,
  //       event_id: eventId,
  //       event_source_url: window.location.href,
  //       custom_data: params,
  //       fbp: getFbp(),
  //       fbc: getFbc(),
  //     },
  //   });
  // } catch {}
}
