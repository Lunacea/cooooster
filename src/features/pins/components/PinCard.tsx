'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import Image from 'next/image';
import type { Pin } from '../types/pin.types';

interface PinCardProps {
  pin: Pin;
}

export function PinCard({ pin }: PinCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                🌊
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                海岸線ファン
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(pin.created_at)}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            📍 {pin.area_name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardTitle className="text-lg mb-3 text-gray-900">{pin.title}</CardTitle>

        {pin.image_url && (
          <div className="mb-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={pin.image_url}
                alt="投稿画像"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>
        )}

        <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">{pin.content}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-1">
            <span className="text-blue-600">📍</span>
            <span>{pin.latitude.toFixed(6)}, {pin.longitude.toFixed(6)}</span>
          </div>
          {pin.distance_to_coastline && (
            <div className="flex items-center gap-1">
              <span className="text-blue-600">🌊</span>
              <span>海岸線から{pin.distance_to_coastline}km</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 