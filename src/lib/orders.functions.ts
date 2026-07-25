import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const PHONE_RE = /^(\+?213|0)?(5|6|7)\d{8}$/;

const lineItemSchema = z.object({
  product_id: z.string().uuid(),
  // May be a real variant UUID, a "size:<label>" pseudo-variant, or null.
  variant_id: z.string().max(120).nullable().optional(),
  variant_label: z.string().max(120).nullable().optional(),
  name_ar: z.string().max(255),
  name_fr: z.string().max(255),
  // Client-supplied price is accepted for shape but IGNORED — recomputed server-side.
  price: z.number().nonnegative().optional(),
  image_url: z.string().max(1000).nullable().optional(),
  qty: z.number().int().min(1).max(99),
});

const inputSchema = z.object({
  customer_name: z.string().trim().min(2).max(120),
  customer_phone: z.string().trim().refine((v) => PHONE_RE.test(v.replace(/\s/g, "")), "invalid phone"),
  customer_email: z.string().email().max(255).optional().nullable(),
  wilaya_id: z.number().int(),
  city_id: z.number().int().nullable().optional(),
  address: z.string().max(500).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  delivery_type: z.enum(["home", "office"]).default("home"),
  items: z.array(lineItemSchema).min(1).max(20),
});

function serverClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const createCustomerOrder = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => inputSchema.parse(raw))
  .handler(async ({ data }) => {
    const ip = clientIp();
    rateLimit("orders", ip, 8);

    const supabase = serverClient();

    // --- Price integrity: recompute every line item's price from the DB. ----
    // The client price is never trusted — a forged request could set price=1.
    const productIds = [...new Set(data.items.map((i) => i.product_id))];
    const { data: products, error: prodErr } = await supabase
      .from("products")
      .select("id, name_ar, name_fr, price, is_active, has_variants, sizes, product_variants(id, label, price)")
      .in("id", productIds)
      .eq("is_active", true);
    if (prodErr) throw new Error(prodErr.message);

    const byId = new Map((products ?? []).map((p) => [p.id, p]));

    const pricedItems = data.items.map((i) => {
      const prod = byId.get(i.product_id);
      if (!prod) throw new Error("Produit indisponible / منتج غير متوفر");

      let unit = Number(prod.price);
      let label: string | null = null;

      if (i.variant_id && !i.variant_id.startsWith("size:")) {
        // Real variant — price MUST come from the matching DB row.
        const v = (prod.product_variants ?? []).find((x) => x.id === i.variant_id);
        if (!v) throw new Error("Variante introuvable / خيار غير موجود");
        unit = Number(v.price);
        label = v.label;
      } else if (i.variant_id?.startsWith("size:")) {
        // Size pseudo-variant — must be one of the product's declared sizes.
        const size = i.variant_id.slice(5);
        const sizes = (prod.sizes ?? []) as string[];
        if (!sizes.includes(size)) throw new Error("Taille invalide / مقاس غير صالح");
        label = size;
      }

      return {
        product_id: prod.id,
        variant_id: i.variant_id ?? null,
        variant_label: label ?? i.variant_label ?? null,
        name_ar: prod.name_ar,
        name_fr: prod.name_fr,
        price: unit,
        image_url: i.image_url ?? null,
        qty: i.qty,
      };
    });

    // Delivery fee from wilaya
    const { data: wilaya, error: wilErr } = await supabase
      .from("wilayas")
      .select("id, delivery_fee_home, delivery_fee_office, is_free_delivery, name_fr, name_ar")
      .eq("id", data.wilaya_id)
      .maybeSingle();
    if (wilErr || !wilaya) throw new Error("Wilaya introuvable");

    const subtotal = pricedItems.reduce((s, i) => s + i.price * i.qty, 0);
    const feeBase = data.delivery_type === "office" ? Number(wilaya.delivery_fee_office) : Number(wilaya.delivery_fee_home);
    const delivery_fee = wilaya.is_free_delivery ? 0 : feeBase;
    const total = subtotal + delivery_fee;

    // Order number
    const { data: numData, error: numErr } = await supabase.rpc("next_order_number");
    if (numErr || !numData) throw new Error("Numéro de commande indisponible");
    const order_number = numData as unknown as string;

    // First item drives the legacy top-level product columns
    const first = pricedItems[0];
    const totalQty = pricedItems.reduce((s, i) => s + i.qty, 0);

    const snapshot = {
      version: 2,
      items: pricedItems,
      wilaya: { id: wilaya.id, name_fr: wilaya.name_fr, name_ar: wilaya.name_ar },
      subtotal,
      delivery_fee,
      total,
    };

    const { error: insErr } = await supabase.from("orders").insert({
      order_number,
      product_id: first.product_id,
      product_snapshot: snapshot,
      customer_name: data.customer_name.trim(),
      customer_phone: data.customer_phone.replace(/\s/g, ""),
      customer_email: data.customer_email ?? null,
      quantity: totalQty,
      unit_price: first.price,
      total_price: total,
      delivery_type: data.delivery_type,
      wilaya_id: data.wilaya_id,
      city_id: data.city_id ?? null,
      address: data.address ?? null,
      notes: data.notes ?? null,
      ip_address: ip === "unknown" ? null : ip.slice(0, 45),
    });
    if (insErr) throw new Error(insErr.message);

    return { order_number, subtotal, delivery_fee, total };
  });
