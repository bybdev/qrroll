'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Wedding } from '@/lib/types/database';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { QRCodeDisplay } from '@/components/admin/QRCodeDisplay';
import { ArrowLeft } from 'lucide-react';

export default function WeddingQRPage() {
  const router = useRouter();
  const params = useParams();
  const weddingId = params.weddingId as string;

  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWedding();
  }, [weddingId]);

  const fetchWedding = async () => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('id', weddingId)
        .single();

      if (error) throw error;
      setWedding(data);
    } catch (error) {
      console.error('Düğün yüklenemedi:', error);
      router.push('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!wedding) {
    return null;
  }

  const weddingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${wedding.slug}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/admin/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard'a Dön
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {wedding.bride_name} & {wedding.groom_name}
            </h1>
            <p className="text-gray-600">
              {new Date(wedding.wedding_date).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Düğün Linki */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <p className="text-sm text-blue-800 mb-1 font-medium">
              Düğün Linki:
            </p>
            <p className="text-blue-600 font-mono break-all">
              {weddingUrl}
            </p>
          </div>

          {/* QR Kod */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              QR Kod
            </h2>
            <QRCodeDisplay 
              url={weddingUrl} 
              weddingName={wedding.slug}
            />
          </div>

          {/* Bilgilendirme */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>💡 Nasıl Kullanılır?</strong>
              <br />
              1. QR kodu indirin
              <br />
              2. Düğünde sergilenmesi için bastırın
              <br />
              3. Misafirler QR'ı okutup fotoğraf yükleyebilir
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push('/admin/dashboard')}
              className="flex-1"
            >
              Dashboard'a Dön
            </Button>
            <Button
              onClick={() => router.push(`/admin/dashboard/${wedding.id}`)}
              className="flex-1"
            >
              Fotoğrafları Gör
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}