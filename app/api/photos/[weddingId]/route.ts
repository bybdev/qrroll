import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { weddingId: string } }
) {
  try {
    const { weddingId } = params;

    // Fotoğrafları getir (yeniden eskiye)
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Fotoğraflar getirilemedi' },
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