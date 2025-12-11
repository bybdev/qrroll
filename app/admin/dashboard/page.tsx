'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Wedding } from '@/lib/types/database';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LogOut, Plus, Calendar, Image, QrCode } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeddings();
  }, []);

  const fetchWeddings = async () => {
    try {
      const response = await fetch('/api/weddings');
      if (response.ok) {
        const data = await response.json();
        setWeddings(data);
      }
    } catch (error) {
      console.error('Düğünler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            QR Roll - Admin Panel
          </h1>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Calendar className="w-6 h-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Toplam Düğün</p>
                <p className="text-2xl font-bold text-gray-800">{weddings.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Image className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Aktif Düğün</p>
                <p className="text-2xl font-bold text-gray-800">
                  {weddings.filter(w => w.is_active).length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <Button
              onClick={() => router.push('/admin/dashboard/new-wedding')}
              className="w-full h-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Düğün Oluştur
            </Button>
          </Card>
        </div>

        {/* Weddings List */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Düğün Listesi
          </h2>

          {weddings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                Henüz düğün oluşturulmamış
              </p>
              <Button onClick={() => router.push('/admin/dashboard/new-wedding')}>
                <Plus className="w-4 h-4 mr-2" />
                İlk Düğünü Oluştur
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {weddings.map((wedding) => (
                <div
                  key={wedding.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {wedding.bride_name} & {wedding.groom_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>📅 {new Date(wedding.wedding_date).toLocaleDateString('tr-TR')}</span>
                      <span>🔗 {wedding.slug}</span>
                      <span className={wedding.is_active ? 'text-green-600' : 'text-red-600'}>
                        {wedding.is_active ? '✓ Aktif' : '✗ Pasif'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => router.push(`/admin/dashboard/qr/${wedding.id}`)}
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      QR
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/admin/dashboard/${wedding.id}`)}
                    >
                      Fotoğraflar
                    </Button>
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