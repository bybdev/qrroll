import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Düğünü sil (CASCADE ile fotoğraflar da silinecek)
    const { error } = await supabase
      .from('weddings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Düğün silinemedi' },
        { status: 500 }
      );
    }

    // Storage'daki klasörü de sil
    const { data: files } = await supabase.storage
      .from('wedding-photos')
      .list(id);

    if (files && files.length > 0) {
      const filePaths = files.map(file => `${id}/${file.name}`);
      await supabase.storage
        .from('wedding-photos')
        .remove(filePaths);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}