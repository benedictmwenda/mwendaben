// Paste your Supabase values here (Supabase -> Project Settings -> API).
// The "anon" key is meant to be public: the database rules in supabase/schema.sql
// only let visitors read published items. NEVER put the "service_role" key here.
window.PORTFOLIO_CONFIG = {
  supabaseUrl: "YOUR_SUPABASE_URL",        // e.g. https://abcdxyz.supabase.co
  supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",
  bucket: "portfolio"
};
