'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Wedding, Photo } from '@/lib/types/database';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Download, Trash2, Image as ImageIcon, Camera, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

// Fotoğraf yükleme fonksiyonu
const uploadWeddingPhoto = async (
  weddingId: string,
  file: File,
  type: 'cover' | 'profile' | 'background'
): Promise<string> => {
  // Supabase Storage'a yükle
  const fileExt = file.name.split('.').pop();
  const fileName = `${weddingId}/${type}_${Date.now()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('wedding-photos')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Public URL al
  const { data: urlData } = supabase.storage
    .from('wedding-photos')
    .getPublicUrl(fileName);

  // Database'i güncelle
  const updateField = `${type}_photo_url`;
  const { error: dbError } = await supabase
    .from('weddings')
    .update({ [updateField]: urlData.publicUrl })
    .eq('id', weddingId);

  if (dbError) throw dbError;

  return urlData.publicUrl;
};

export default function WeddingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const weddingId = params.weddingId as string;

  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);

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

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'cover' | 'profile' | 'background'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(type);

    try {
      await uploadWeddingPhoto(weddingId, file, type);
      await fetchWedding(); // Refresh
      alert('Fotoğraf başarıyla yüklendi!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Fotoğraf yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setUploadingPhoto(null);
    }
  };

  const handleDownloadAll = async () => {
    if (photos.length === 0) {
      alert('İndirilecek fotoğraf yok!');
      return;
    }

    const confirmDownload = confirm(`${photos.length} fotoğrafı ZIP olarak indirmek istiyor musunuz?`);
    if (!confirmDownload) return;

    setDownloading(true);

    try {
      const response = await fetch('/api/download-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weddingId }),
      });

      if (!response.ok) throw new Error('ZIP oluşturulamadı');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${wedding?.slug}-photos.zip`;
      link.click();
      window.URL.revokeObjectURL(url);

      alert('Fotoğraflar başarıyla indirildi!');
    } catch (error) {
      console.error('Download failed:', error);
      alert('İndirme başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setDownloading(false);
    }
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
          <div className="flex items-start justify-between mb-6">
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
              <Button 
                onClick={handleDownloadAll} 
                disabled={photos.length === 0 || downloading}
              >
                <Download className="w-4 h-4 mr-2" />
                {downloading ? 'İndiriliyor...' : 'Tümünü İndir'}
              </Button>
              <Button variant="danger" onClick={handleDeleteWedding} disabled={deleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? 'Siliniyor...' : 'Düğünü Sil'}
              </Button>
            </div>
          </div>

          {/* Fotoğraf Yönetimi */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Düğün Fotoğrafları Yönetimi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cover Photo */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2 text-center">
                  Cover Photo (Arka Plan)
                </p>
                {wedding.cover_photo_url ? (
                  <img
                    src={wedding.cover_photo_url}
                    alt="Cover"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <label className="cursor-pointer block text-center">
                  <span className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                    {uploadingPhoto === 'cover' ? 'Yükleniyor...' : 'Fotoğraf Yükle'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'cover')}
                    disabled={uploadingPhoto !== null}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Profile Photo */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2 text-center">
                  Profile Photo (Çift Fotoğrafı)
                </p>
                {wedding.profile_photo_url ? (
                  <img
                    src={wedding.profile_photo_url}
                    alt="Profile"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <label className="cursor-pointer block text-center">
                  <span className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                    {uploadingPhoto === 'profile' ? 'Yükleniyor...' : 'Fotoğraf Yükle'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'profile')}
                    disabled={uploadingPhoto !== null}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Background Photo */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2 text-center">
                  Background Photo (Albüm Arkaplanı)
                </p>
                {wedding.background_photo_url ? (
                  <img
                    src={wedding.background_photo_url}
                    alt="Background"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <label className="cursor-pointer block text-center">
                  <span className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                    {uploadingPhoto === 'background' ? 'Yükleniyor...' : 'Fotoğraf Yükle'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'background')}
                    disabled={uploadingPhoto !== null}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              💡 Bu fotoğraflar misafirlerin gördüğü sayfada kullanılır.
            </p>
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