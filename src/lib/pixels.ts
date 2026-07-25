// Meta (Facebook) Pixel + TikTok Pixel event tracking.
// IDs come from environment variables — never hardcode them:
//   VITE_META_PIXEL_ID     e.g. "1234567890"
//   VITE_TIKTOK_PIXEL_ID   e.g. "CABC12DEF34GHI"
// When an ID is absent the corresponding pixel simply no-ops, so local/dev
// builds and previews stay clean.

const META_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const TIKTOK_ID = import.meta.env.VITE_TIKTOK_PIXEL_ID as string | undefined;

const CURRENCY = "DZD";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void;
      [key: string]: unknown;
    };
    TiktokAnalyticsObject?: string;
  }
}

let initialized = false;

/** Injects the pixel base scripts once, on the client. Safe to call repeatedly. */
export function initPixels() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  if (META_ID) loadMeta(META_ID);
  if (TIKTOK_ID) loadTikTok(TIKTOK_ID);
}

function loadMeta(id: string) {
  if (window.fbq) return;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const n: any = (window.fbq = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod.apply(n, args);
    else n.queue.push(args);
  });
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  window.fbq!("init", id);
  window.fbq!("track", "PageView");
}

function loadTikTok(id: string) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const w = window as any;
  const t = "ttq";
  w.TiktokAnalyticsObject = t;
  const ttq = (w[t] = w[t] || []);
  if (ttq.loaded) return;
  ttq.methods = [
    "page", "track", "identify", "instances", "debug", "on", "off", "once",
    "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent",
    "revokeConsent", "grantConsent",
  ];
  ttq.setAndDefer = function (obj: any, m: string) {
    obj[m] = function () {
      obj.push([m].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };
  for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
  ttq.instance = function (name: string) {
    const e = ttq._i[name] || [];
    for (let n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
    return e;
  };
  ttq.load = function (e: string, n?: unknown) {
    const r = "https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i = ttq._i || {};
    ttq._i[e] = [];
    ttq._i[e]._u = r;
    ttq._t = ttq._t || {};
    ttq._t[e] = +new Date();
    ttq._o = ttq._o || {};
    ttq._o[e] = n || {};
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = r + "?sdkid=" + e + "&lib=" + t;
    const f = document.getElementsByTagName("script")[0];
    f.parentNode!.insertBefore(s, f);
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */
  ttq.loaded = true;
  ttq.load(id);
  ttq.page();
}

export interface PixelProduct {
  id: string;
  name: string;
  price: number;
  qty?: number;
}

function metaContents(items: PixelProduct[]) {
  return items.map((i) => ({ id: i.id, quantity: i.qty ?? 1, item_price: i.price }));
}

/** Fired on product page load. */
export function trackViewContent(p: PixelProduct) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "ViewContent", {
    content_ids: [p.id],
    content_name: p.name,
    content_type: "product",
    value: p.price,
    currency: CURRENCY,
  });
  window.ttq?.track("ViewContent", {
    content_id: p.id,
    content_type: "product",
    content_name: p.name,
    value: p.price,
    currency: CURRENCY,
  });
}

/** Fired when an item is added to the cart. */
export function trackAddToCart(p: PixelProduct) {
  if (typeof window === "undefined") return;
  const qty = p.qty ?? 1;
  window.fbq?.("track", "AddToCart", {
    content_ids: [p.id],
    content_name: p.name,
    content_type: "product",
    value: p.price * qty,
    currency: CURRENCY,
  });
  window.ttq?.track("AddToCart", {
    content_id: p.id,
    content_type: "product",
    content_name: p.name,
    quantity: qty,
    value: p.price * qty,
    currency: CURRENCY,
  });
}

/** Fired when a product order is submitted successfully. */
export function trackPurchase(value: number, items: PixelProduct[]) {
  if (typeof window === "undefined") return;
  const ids = items.map((i) => i.id);
  window.fbq?.("track", "Purchase", {
    content_ids: ids,
    content_type: "product",
    value,
    currency: CURRENCY,
  });
  window.ttq?.track("PlaceAnOrder", {
    contents: metaContents(items),
    value,
    currency: CURRENCY,
  });
  window.ttq?.track("CompletePayment", {
    contents: metaContents(items),
    value,
    currency: CURRENCY,
  });
}

/** Fired when a lead form (e.g. home-visit booking) is submitted. */
export function trackLead(value?: number) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Lead", value != null ? { value, currency: CURRENCY } : undefined);
  window.ttq?.track("SubmitForm", value != null ? { value, currency: CURRENCY } : {});
}
