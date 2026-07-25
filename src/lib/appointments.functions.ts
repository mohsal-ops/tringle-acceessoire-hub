import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const PHONE_RE = /^(\+?213|0)?(5|6|7)\d{8}$/;

const inputSchema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  customer_phone: z.string().trim().refine((v) => PHONE_RE.test(v.replace(/\s/g, "")), "invalid phone"),
  customer_email: z.string().email().max(255).optional().nullable(),
  wilaya_id: z.number().int(),
  city_id: z.number().int().nullable().optional(),
  // ISO date string yyyy-MM-dd
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid date"),
  window_count: z.number().int().min(1).max(50),
  description: z.string().max(500).optional().nullable(),
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

export const createAppointment = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => inputSchema.parse(raw))
  .handler(async ({ data }) => {
    const ip = clientIp();
    // Appointments are lower-frequency than orders — tighter limit.
    rateLimit("appointments", ip, 4);

    const supabase = serverClient();

    // travel_cost is authoritative from settings, never trusted from the client.
    const { data: setting } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "travel_cost")
      .maybeSingle();
    const travel_cost = Number(setting?.value ?? 3000) || 3000;

    const { data: numData, error: numErr } = await supabase.rpc("next_appointment_number");
    if (numErr || !numData) throw new Error("Numéro de rendez-vous indisponible");
    const appointment_number = numData as unknown as string;

    const { error: insErr } = await supabase.from("appointments").insert({
      appointment_number,
      customer_name: data.customer_name.trim(),
      customer_phone: data.customer_phone.replace(/\s/g, ""),
      customer_email: data.customer_email?.trim() || null,
      wilaya_id: data.wilaya_id,
      city_id: data.city_id ?? null,
      preferred_date: data.preferred_date,
      window_count: data.window_count,
      description: data.description?.trim() || null,
      travel_cost,
      ip_address: ip === "unknown" ? null : ip.slice(0, 45),
    });
    if (insErr) throw new Error(insErr.message);

    return { appointment_number };
  });
