'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Wedding, Photo } from '@/lib/types/database';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Heart, Camera, Upload, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

export default function GuestPage() {
  const params = useParams();
  const slug = params.slug as string;

  // States
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Step states
  const [step, setStep] = useState(1); // 1: İsim, 2: Albüm, 3: Upload
  const [guestName, setGuestName] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchWedding();
  }, [slug]);

  useEffect(() => {
    if (wedding && step === 2) {
      fetchPhotos();
    }
  }, [wedding, step]);

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
    }
  };

  const fetchPhotos = async () => {
    if (!wedding) return;
    try {
      const response = await fetch(`/api/photos/${wedding.id}`);
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (err) {
      console.error('Fotoğraflar yüklenemedi:', err);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedPhoto || !wedding) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('wedding_id', wedding.id);
      formData.append('guest_name', guestName);
      formData.append('message', message);
      formData.append('photo', selectedPhoto);

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Yükleme başarısız');

      setUploadSuccess(true);
      fetchPhotos();

      // Reset form
      setTimeout(() => {
        setSelectedPhoto(null);
        setPhotoPreview(null);
        setMessage('');
        setStep(2);
        setUploadSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
    }
  };

  // Loading state
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

  // Error state
  if (error && !wedding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Düğün Bulunamadı
          </h1>
          <p className="text-gray-600">{error}</p>
        </Card>
      </div>
    );
  }

  if (!wedding) return null;

  // Default images
  const defaultCover = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200';
  const coverPhoto = wedding.cover_photo_url || defaultCover;
  const profilePhoto = wedding.profile_photo_url;

  // STEP 1: İsim Girişi
  // STEP 1: İsim Girişi
if (step === 1) {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${coverPhoto})`,
        backgroundColor: 'rgba(0,0,0,0.5)', // Arka planı biraz karartıyoruz
        backgroundBlendMode: 'overlay'
      }}
    >
      <Card className="max-w-md w-full backdrop-blur-sm bg-white/100 p-5 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white shadow-lg overflow-hidden">
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt="Couple" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                <Heart className="w-12 h-12 text-white fill-white" />
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {wedding.bride_name} & {wedding.groom_name}
          </h1>
          <p className="text-gray-600 mb-4">
            {new Date(wedding.wedding_date).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="text-lg text-gray-700">
            Lütfen bu özel gün için fotoğraf ve videolarınızı bizimle paylaşın! 💖
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Adınız"
            placeholder="Adınızı girin"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />

          <Button
            onClick={() => setStep(2)}
            disabled={!guestName.trim()}
            className="w-full text-lg py-4"
          >
            Hadi Gidelim!
          </Button>
        </div>
      </Card>
    </div>
  );
}


  // STEP 2: Albüm Görünümü (Instagram Grid)
  if (step === 2) {
    const backgroundStyle = wedding.background_photo_url 
      ? {
          backgroundImage: `url(${wedding.background_photo_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }
      : {};

    return (
      <div className="min-h-screen bg-gray-50" style={backgroundStyle}>
        {/* Header with Back Button */}
        <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span className="text-sm">Change name</span>
              </button>
              <div className="text-sm text-gray-600">
                {guestName}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white shadow-md overflow-hidden">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Couple" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-800 text-center mt-2">
              {wedding.bride_name} & {wedding.groom_name}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Button
            onClick={() => setStep(3)}
            className="w-full py-6 text-lg mb-6 bg-pink-600 hover:bg-pink-700"
          >
            <Camera className="w-5 h-5 mr-2" />
            Add to album
          </Button>

          <div className="mb-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <h2 className="text-lg font-semibold text-gray-800">
              {photos.length} photos, videos & posts
            </h2>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-lg">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Be the first to share! 📸</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square overflow-hidden bg-white"
                >
                  <img
                    src={photo.photo_url}
                    alt={photo.guest_name}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // STEP 3: Fotoğraf Yükleme
  if (step === 3) {
    if (uploadSuccess) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Uploaded Successfully!
            </h2>
            <p className="text-gray-600">
              Your photo has been added to the album.
            </p>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <button
              onClick={() => setStep(2)}
              className="text-pink-600 font-medium flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to album
            </button>
            <h1 className="text-xl font-bold text-gray-800 mt-2 text-center">
              {wedding.bride_name} & {wedding.groom_name} Wedding
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-4 py-6">
          {!selectedPhoto ? (
            <label className="block">
              <div className="border-4 border-dashed border-pink-300 rounded-xl p-12 text-center cursor-pointer hover:border-pink-500 transition-colors bg-white">
                <Camera className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                <p className="text-2xl font-bold text-pink-600 mb-2">
                  Pick Photos & Videos
                </p>
                <p className="text-gray-600">Tap to select from your device</p>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </label>
          ) : (
            <Card>
              {/* Preview */}
              <div className="mb-4">
                <img
                  src={photoPreview!}
                  alt="Preview"
                  className="w-full rounded-lg"
                />
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a message (optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={3}
                  placeholder="Write your wishes..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedPhoto(null);
                    setPhotoPreview(null);
                  }}
                  disabled={uploading}
                  className="flex-1"
                >
                  Change Photo
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return null;
}