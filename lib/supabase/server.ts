import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server-side Supabase client (API routes ve Server Components için)
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    'https://tnpbgtjxihkbconhtntv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucGJndGp4aWhrYmNvbmh0bnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjU0MjAsImV4cCI6MjA4MTAwMTQyMH0.bfe579GtgCGUSYjQ7SCESmo1dhEbk71tbLt_6s1l35g',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component'te cookie set edilemez
          }
        },
      },
    }
  );
}