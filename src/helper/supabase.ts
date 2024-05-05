import { createClient } from "@supabase/supabase-js";
export const supabase:any = createClient(
  import.meta.env.VITE_LINK,
  import.meta.env.VITE_PUBLIC_KEY,
);
