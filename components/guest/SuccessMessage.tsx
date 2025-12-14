'use client';

import { Card } from '@/components/ui/Card';
import { CheckCircle } from 'lucide-react';

export function SuccessMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-md text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Yükleme başarıyla tamamlandı! 🎉
        </h2>
        <p className="text-gray-600 text-lg">
          Fotoğrafınız albüme eklendi.
        </p>
      </Card>
    </div>
  );
}