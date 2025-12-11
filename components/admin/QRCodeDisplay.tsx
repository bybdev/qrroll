'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, Loader2 } from 'lucide-react';

interface QRCodeDisplayProps {
  url: string;
  weddingName: string;
}

export function QRCodeDisplay({ url, weddingName }: QRCodeDisplayProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateQR();
  }, [url]);

  const generateQR = async () => {
    try {
      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('QR oluşturulamadı');

      const data = await response.json();
      setQrCode(data.qrCode);
    } catch (error) {
      console.error('QR generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-${weddingName}.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">QR kod oluşturulamadı</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200 inline-block">
        <img src={qrCode} alt="QR Code" className="w-64 h-64" />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          QR Kodu İndir
        </Button>
      </div>
      <p className="text-sm text-gray-600">
        Bu QR kodu düğünde sergileyebilir veya davetiyeye ekleyebilirsiniz.
      </p>
    </div>
  );
}