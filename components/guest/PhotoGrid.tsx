'use client';

import { Photo } from '@/lib/types/database';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface PhotoGridProps {
  photos: Photo[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Henüz fotoğraf yüklenmemiş. İlk fotoğrafı siz yükleyin! 📸
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            <img
              src={photo.photo_url}
              alt={`${photo.guest_name} tarafından yüklendi`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-1">
              {photo.guest_name}
            </h3>
            {photo.message && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-3">
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
  );
}