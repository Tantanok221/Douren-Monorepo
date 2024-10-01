import { createClient } from "@supabase/supabase-js";
export const supabase:any = createClient(
  import.meta.env.VITE_LINK,
  import.meta.env.VITE_PUBLIC_KEY,
);
export const supabaseBaseURL = import.meta.env.VITE_LINK;
export const supabasePublicKey = import.meta.env.VITE_PUBLIC_KEY;