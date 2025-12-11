import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL gerekli' },
        { status: 400 }
      );
    }

    // QR kod oluştur (base64 PNG)
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 800,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return NextResponse.json({ qrCode: qrCodeDataURL }, { status: 200 });
  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json(
      { error: 'QR kod oluşturulamadı' },
      { status: 500 }
    );
  }
}