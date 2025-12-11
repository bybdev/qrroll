import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const weddingId = formData.get('wedding_id') as string;
    const guestName = formData.get('guest_name') as string;
    const message = formData.get('message') as string;
    const photoFile = formData.get('photo') as File;

    if (!weddingId || !guestName || !photoFile) {
      return NextResponse.json(
        { error: 'Eksik bilgi' },
        { status: 400 }
      );
    }

    // Dosya adı oluştur (unique)
    const fileExt = photoFile.name.split('.').pop();
    const fileName = `${weddingId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Supabase Storage'a yükle
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('wedding-photos')
      .upload(fileName, photoFile, {
        contentType: photoFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Fotoğraf yüklenemedi' },
        { status: 500 }
      );
    }

    // Public URL al
    const { data: urlData } = supabase.storage
      .from('wedding-photos')
      .getPublicUrl(fileName);

    // Database'e kaydet
    const { data: photoData, error: dbError } = await supabase
      .from('photos')
      .insert({
        wedding_id: weddingId,
        guest_name: guestName,
        message: message || null,
        photo_url: urlData.publicUrl,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Storage'dan dosyayı sil
      await supabase.storage.from('wedding-photos').remove([fileName]);
      return NextResponse.json(
        { error: 'Fotoğraf kaydedilemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json(photoData, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}