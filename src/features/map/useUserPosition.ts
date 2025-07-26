import { useState, useEffect } from 'react';
import type { Position } from '@/types/map.types';

export function useUserPosition() {
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPositionResolved, setIsPositionResolved] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('このブラウザは位置情報取得に対応していません。');
      setIsLoading(false);
      setIsPositionResolved(true);
      return;
    }

    console.log('位置情報取得開始...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Position = [position.coords.latitude, position.coords.longitude];
        console.log(`現在地取得: [${coords[0]}, ${coords[1]}]`);
        setUserPosition(coords);
        setIsLoading(false);
        setIsPositionResolved(true);
        console.log('位置情報取得完了');
      },
      (error) => {
        console.log('位置情報取得失敗:', error.message);
        setError('現在地の取得に失敗しました。');
        setIsLoading(false);
        setIsPositionResolved(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5分
      }
    );
  }, []);

  return { userPosition, isLoading, error, isPositionResolved };
} 