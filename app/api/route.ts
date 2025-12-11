import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// Slug ile düğün getir (misafir için)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (slug) {
      // Slug ile tek düğün getir
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Düğün bulunamadı' },
          { status: 404 }
        );
      }

      return NextResponse.json(data, { status: 200 });
    }

    // Tüm düğünleri getir (admin için)
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Düğünler getirilemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}