'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Wedding, Photo } from '@/lib/types/database';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function WeddingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const weddingId = params.weddingId as string;

  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchWedding();
    fetchPhotos();
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

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`/api/photos/${weddingId}`);
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error('Fotoğraflar yüklenemedi:', error);
    }
  };

  const handleDownloadAll = async () => {
    alert('ZIP indirme özelliği henüz eklenmedi. Yakında eklenecek!');
  };

  const handleDeleteWedding = async () => {
    if (!confirm('Bu düğünü ve tüm fotoğrafları silmek istediğinize emin misiniz?')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/weddings/${weddingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Silinemedi');

      router.push('/admin/dashboard');
    } catch (error) {
      alert('Düğün silinemedi. Lütfen tekrar deneyin.');
      console.error(error);
    } finally {
      setDeleting(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/admin/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Wedding Info */}
        <Card className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {wedding.bride_name} & {wedding.groom_name}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span>📅 {new Date(wedding.wedding_date).toLocaleDateString('tr-TR')}</span>
                <span>🔗 {wedding.slug}</span>
                <span className={wedding.is_active ? 'text-green-600' : 'text-red-600'}>
                  {wedding.is_active ? '✓ Aktif' : '✗ Pasif'}
                </span>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg inline-block">
                <p className="text-sm text-blue-800 font-mono">
                  {process.env.NEXT_PUBLIC_BASE_URL}/{wedding.slug}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleDownloadAll} disabled={photos.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Tümünü İndir
              </Button>
              <Button variant="danger" onClick={handleDeleteWedding} disabled={deleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? 'Siliniyor...' : 'Düğünü Sil'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Photos */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Yüklenen Fotoğraflar ({photos.length})
          </h2>

          {photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz fotoğraf yüklenmemiş</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img
                      src={photo.photo_url}
                      alt={`${photo.guest_name} tarafından yüklendi`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      {photo.guest_name}
                    </h3>
                    {photo.message && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {photo.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(photo.uploaded_at), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}