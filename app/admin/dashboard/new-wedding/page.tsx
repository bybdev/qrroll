'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { QRCodeDisplay } from '@/components/admin/QRCodeDisplay';
import { slugify } from '@/lib/utils/slugify';
import { ArrowLeft, Calendar, CheckCircle } from 'lucide-react';

export default function NewWeddingPage() {
  const router = useRouter();
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdWedding, setCreatedWedding] = useState<any>(null);

  const generateSlug = () => {
    if (brideName && groomName) {
      return slugify(`${brideName}-${groomName}`);
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const slug = customSlug || generateSlug();

      if (!slug) {
        setError('Lütfen isim bilgilerini doldurun');
        setLoading(false);
        return;
      }

      // Slug kontrolü
      const { data: existingWedding } = await supabase
        .from('weddings')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existingWedding) {
        setError('Bu isimde bir düğün zaten var. Farklı isimler deneyin.');
        setLoading(false);
        return;
      }

      // Düğün oluştur
      const { data, error: insertError } = await supabase
        .from('weddings')
        .insert({
          slug,
          bride_name: brideName,
          groom_name: groomName,
          wedding_date: weddingDate,
          is_active: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Başarılı - QR göster
      setCreatedWedding(data);
    } catch (err: any) {
      setError(err.message || 'Düğün oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  // QR ekranı
  if (createdWedding) {
    const weddingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${createdWedding.slug}`;
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-3xl mx-auto px-4 py-4">
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

        {/* Success Content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Card>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Düğün Başarıyla Oluşturuldu! 🎉
              </h1>
              <p className="text-gray-600">
                {createdWedding.bride_name} & {createdWedding.groom_name}
              </p>
            </div>

            <div className="space-y-6">
              {/* Düğün Linki */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                  weddingName={createdWedding.slug}
                />
              </div>

              {/* Bilgilendirme */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
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

              {/* Düğün Bilgileri */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Gelin</p>
                  <p className="font-semibold">{createdWedding.bride_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Damat</p>
                  <p className="font-semibold">{createdWedding.groom_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tarih</p>
                  <p className="font-semibold">
                    {new Date(createdWedding.wedding_date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Durum</p>
                  <p className="font-semibold text-green-600">Aktif</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => router.push('/admin/dashboard')}
                  className="flex-1"
                >
                  Dashboard'a Dön
                </Button>
                <Button
                  onClick={() => router.push(`/admin/dashboard/${createdWedding.id}`)}
                  className="flex-1"
                >
                  Fotoğrafları Gör
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Form ekranı
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <div className="flex items-center mb-6">
            <div className="p-3 bg-pink-100 rounded-lg">
              <Calendar className="w-6 h-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Yeni Düğün Oluştur
              </h1>
              <p className="text-gray-600 text-sm">
                Düğün bilgilerini girin ve QR kod oluşturun
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Gelin Adı *"
                placeholder="Örn: Ayşe"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                disabled={loading}
                required
              />

              <Input
                label="Damat Adı *"
                placeholder="Örn: Mehmet"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <Input
              type="date"
              label="Düğün Tarihi *"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              disabled={loading}
              required
            />

            {brideName && groomName && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-1">
                  <strong>Oluşturulacak Link:</strong>
                </p>
                <p className="text-blue-600 font-mono">
                  {process.env.NEXT_PUBLIC_BASE_URL}/{customSlug || generateSlug()}
                </p>
              </div>
            )}

            <Input
              label="Özel Link (İsteğe bağlı)"
              placeholder="Örn: ayse-mehmet-2025"
              value={customSlug}
              onChange={(e) => setCustomSlug(slugify(e.target.value))}
              disabled={loading}
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin/dashboard')}
                disabled={loading}
              >
                İptal
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Oluşturuluyor...' : 'Düğün Oluştur'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}