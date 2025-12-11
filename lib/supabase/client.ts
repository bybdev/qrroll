import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = 'https://tnpbgtjxihkbconhtntv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucGJndGp4aWhrYmNvbmh0bnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjU0MjAsImV4cCI6MjA4MTAwMTQyMH0.bfe579GtgCGUSYjQ7SCESmo1dhEbk71tbLt_6s1l35g';

// Browser için Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});