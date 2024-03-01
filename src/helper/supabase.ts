import { createClient } from '@supabase/supabase-js'
import { Database } from "../../types/supabase"
export const supabase = createClient<Database>(import.meta.env.VITE_LINK, import.meta.env.VITE_PUBLIC_KEY )


