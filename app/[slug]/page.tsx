'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Wedding } from '@/lib/types/database';
import { UploadForm } from '@/components/guest/UploadForm';
import { Card } from '@/components/ui/Card';
import { Heart, Camera } from 'lucide-react';

export default function GuestPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWedding = async () => {
    try {
      const response = await fetch(`/api/weddings?slug=${slug}`);
      if (!response.ok) {
        throw new Error('Düğün bulunamadı');
      }
      const data = await response.json();
      setWedding(data);
      setLoading(false);
    } catch (err) {
      setError('Bu düğün bulunamadı veya artık aktif değil.');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWedding();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !wedding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Düğün Bulunamadı
          </h1>
          <p className="text-gray-600">
            {error || 'Bu düğün mevcut değil veya kaldırılmış.'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-pink-600 fill-pink-600 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
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
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <div className="flex items-center mb-4">
            <Camera className="w-6 h-6 text-pink-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">
              Fotoğraf Yükle
            </h2>
          </div>
          <UploadForm
            weddingId={wedding.id}
            onUploadSuccess={() => {}} // Artık refresh'e gerek yok
          />
        </Card>
      </div>
    </div>
  );
}