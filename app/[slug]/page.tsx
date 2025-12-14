'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Wedding, Photo } from '@/lib/types/database';
import { Card } from '@/components/ui/Card';
import { WelcomeStep } from '@/components/guest/WelcomeStep';
import { AlbumStep } from '@/components/guest/AlbumStep';
import { UploadStep } from '@/components/guest/UploadStep';
import { SuccessMessage } from '@/components/guest/SuccessMessage';

export default function GuestPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Data states
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI states
  const [step, setStep] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch wedding data
  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const response = await fetch(`/api/weddings?slug=${slug}`);
        if (!response.ok) throw new Error('Düğün bulunamadı');
        
        const data = await response.json();
        setWedding(data);
      } catch (err) {
        setError('Bu düğün bulunamadı veya artık aktif değil.');
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, [slug]);

  // Fetch photos when on album step
  useEffect(() => {
    if (wedding && step === 2) {
      fetchPhotos();
    }
  }, [wedding, step]);

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

  const handleUploadSuccess = () => {
    setShowSuccess(true);
    fetchPhotos();
    
    setTimeout(() => {
      setShowSuccess(false);
      setStep(2);
    }, 2500);
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
  if (error || !wedding) {
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

  // Success message
  if (showSuccess) {
    return <SuccessMessage />;
  }

  // Render current step
  if (step === 1) {
    return (
      <WelcomeStep
        wedding={wedding}
        guestName={guestName}
        onNameChange={setGuestName}
        onContinue={() => setStep(2)}
      />
    );
  }

  if (step === 2) {
    return (
      <AlbumStep
        wedding={wedding}
        photos={photos}
        guestName={guestName}
        onBack={() => setStep(1)}
        onAddPhoto={() => setStep(3)}
      />
    );
  }

  if (step === 3) {
    return (
      <UploadStep
        wedding={wedding}
        guestName={guestName}
        onBack={() => setStep(2)}
        onUploadSuccess={handleUploadSuccess}
      />
    );
  }

  return null;
}