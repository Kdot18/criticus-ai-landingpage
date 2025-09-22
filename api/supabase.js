const { createClient } = require('@supabase/supabase-js');

// Create Supabase client for server-side use
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for server-side operations
);

module.exports = supabase;