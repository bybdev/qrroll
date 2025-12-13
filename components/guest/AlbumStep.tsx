'use client';

import { Wedding, Photo } from '@/lib/types/database';
import { Heart, Camera, ArrowLeft } from 'lucide-react';

interface AlbumStepProps {
  wedding: Wedding;
  photos: Photo[];
  guestName: string;
  onBack: () => void;
  onAddPhoto: () => void;
}

export function AlbumStep({ wedding, photos, guestName, onBack, onAddPhoto }: AlbumStepProps) {
  const defaultCover = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200';
  const coverPhoto = wedding.cover_photo_url || defaultCover;
  const profilePhoto = wedding.profile_photo_url;
  const backgroundPhoto = wedding.background_photo_url || coverPhoto;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${backgroundPhoto})`,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="text-white/80 hover:text-white text-sm flex items-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Change name
            </button>
            <div className="text-sm text-white/90 font-medium">
              {guestName}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white shadow-2xl overflow-hidden mb-3 ring-4 ring-white/20">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Couple" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white fill-white" />
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              {wedding.bride_name} & {wedding.groom_name} Wedding
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Add to Album Button */}
        <button
          onClick={onAddPhoto}
          className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-6 rounded-2xl shadow-2xl mb-6 flex items-center justify-center text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-3xl mr-3">+</span>
          Add to album
        </button>

        {/* Photo Count */}
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-white drop-shadow-lg">
            {photos.length} photos, videos & posts
          </h2>
        </div>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div className="text-center py-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
            <Camera className="w-20 h-20 text-white/60 mx-auto mb-4" />
            <p className="text-white/80 text-lg font-medium drop-shadow-md">
              Be the first to share! 📸
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 pb-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square overflow-hidden bg-black/40 backdrop-blur-sm shadow-lg"
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