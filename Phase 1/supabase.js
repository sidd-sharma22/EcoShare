// ==========================================
// EcoShare Supabase Client
// ==========================================

const SUPABASE_URL =
  "https://cplbvftcbiwgqkeqmrbq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_mbOq6IqrCKVe0MpCV1a_1A_PduKLGVh";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);