'use client';

import { useState } from 'react';
import { Wedding } from '@/lib/types/database';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Camera, Upload, Loader2, ArrowLeft } from 'lucide-react';

interface UploadStepProps {
  wedding: Wedding;
  guestName: string;
  onBack: () => void;
  onUploadSuccess: () => void;
}

export function UploadStep({ wedding, guestName, onBack, onUploadSuccess }: UploadStepProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

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

      onUploadSuccess();
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="text-pink-600 font-medium flex items-center hover:text-pink-700 transition-colors"
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
            <div className="border-4 border-dashed border-pink-300 rounded-xl p-12 text-center cursor-pointer hover:border-pink-500 transition-colors bg-white shadow-lg hover:shadow-xl">
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
                disabled={uploading}
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