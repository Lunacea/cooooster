'use client';

import { useEffect, useState } from 'react';
import { PinCard } from './PinCard';
import { getPins } from '../api/getPins';
import type { Pin } from '../types/pin.types';
import { LoadingSpinner } from '../../map/components/LoadingSpinner';

interface PinListProps {
  prefecture?: string;
  area?: string;
}

export function PinList({ prefecture, area }: PinListProps) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPins = async () => {
      setIsLoading(true);
      setError(null);

      const result = await getPins(prefecture, area);

      if (result.success) {
        setPins(result.data || []);
      } else {
        setError(result.error || 'ピンの取得に失敗しました');
      }

      setIsLoading(false);
    };

    fetchPins();
  }, [prefecture, area]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner title="ピンを読み込み中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">このエリアにはまだピンが投稿されていません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pins.map((pin) => (
        <PinCard key={pin.id} pin={pin} />
      ))}
    </div>
  );
} 