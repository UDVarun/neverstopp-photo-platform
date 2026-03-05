import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://odynwvqylqwmoihlepps.supabase.co"
const supabaseAnonKey = "sb_publishable_WTmMtcepFpnc8wXp1yVckw_2oVnyzk1"

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)