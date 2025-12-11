'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Upload, Loader2 } from 'lucide-react';

interface UploadFormProps {
  weddingId: string;
  onUploadSuccess: () => void;
}

export function UploadForm({ weddingId, onUploadSuccess }: UploadFormProps) {
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      // Preview oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasyon
    if (!guestName.trim()) {
      setError('Lütfen adınızı yazın');
      return;
    }
    if (!photo) {
      setError('Lütfen bir fotoğraf seçin');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('wedding_id', weddingId);
      formData.append('guest_name', guestName);
      formData.append('message', message);
      formData.append('photo', photo);

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Fotoğraf yüklenemedi');
      }

      // Başarılı - formu temizle
      setGuestName('');
      setMessage('');
      setPhoto(null);
      setPreview(null);
      onUploadSuccess();
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Adınız *"
        placeholder="Örn: Ahmet Yılmaz"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        disabled={loading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mesajınız (İsteğe bağlı)
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          rows={3}
          placeholder="Mutluluklar dilerim..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fotoğraf Seç *
        </label>
        <div className="flex flex-col items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Tıklayın</span> veya sürükleyin
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP (Max 10MB)</p>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handlePhotoChange}
              disabled={loading}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
            Yükleniyor...
          </>
        ) : (
          'Fotoğrafı Yükle'
        )}
      </Button>
    </form>
  );
}