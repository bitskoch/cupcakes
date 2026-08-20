import { createClient } from "@supabase/supabase-js";

// En desarrollo local (sin Supabase todavía) estas variables pueden venir vacías.
// Usamos placeholders para que el cliente no explote al importarse; las llamadas
// reales a Storage recién se activan cuando completes las credenciales en .env.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Cliente para el navegador (uploads desde el panel admin).
 * Usa la anon key: solo puede escribir en el bucket "products"
 * gracias a las policies configuradas en Supabase.
 */
export const supabaseBrowser = createClient(supabaseUrl, anonKey);

/**
 * Cliente para el servidor (Server Actions / Route Handlers).
 * Usa la service role key: bypassa RLS, úsalo solo en código de servidor.
 */
export function supabaseServer() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}

export const PRODUCT_IMAGES_BUCKET = "products";
