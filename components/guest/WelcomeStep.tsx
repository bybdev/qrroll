'use client';

import { Wedding } from '@/lib/types/database';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Heart } from 'lucide-react';

interface WelcomeStepProps {
  wedding: Wedding;
  guestName: string;
  onNameChange: (name: string) => void;
  onContinue: () => void;
}

export function WelcomeStep({ wedding, guestName, onNameChange, onContinue }: WelcomeStepProps) {
  const defaultCover = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200';
  const coverPhoto = wedding.cover_photo_url || defaultCover;
  const profilePhoto = wedding.profile_photo_url;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${coverPhoto})`,
        backgroundColor: 'rgba(0,0,0,0.5)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <Card className="max-w-md w-full backdrop-blur-sm bg-white/95">
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
            Please Share your photos & videos with us for this special day! 💖
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter your name"
            value={guestName}
            onChange={(e) => onNameChange(e.target.value)}
            required
          />

          <Button
            onClick={onContinue}
            disabled={!guestName.trim()}
            className="w-full text-lg py-4"
          >
            Let's Go!
          </Button>
        </div>
      </Card>
    </div>
  );
}