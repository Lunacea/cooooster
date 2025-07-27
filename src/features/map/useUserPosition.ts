import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Position } from '@/types/map.types';

// テストユーザーかどうかを判定する関数
const checkTestUser = async (): Promise<boolean> => {
  try {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email === 'test@cooooster.com';
  } catch {
    return false;
  }
};

// 築地の位置情報（テスト用）
const tsukijiPosition: Position = [35.6654, 139.7704]; // 築地市場付近

export function useUserPosition() {
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPositionResolved, setIsPositionResolved] = useState(false);
  const [isTestUser, setIsTestUser] = useState(false);

  useEffect(() => {
    const initializePosition = async () => {
      console.log('useUserPosition: 位置情報初期化開始');
      // テストユーザーかどうかを確認
      const testUser = await checkTestUser();
      console.log('useUserPosition: テストユーザー判定結果:', testUser);
      setIsTestUser(testUser);

      if (testUser) {
        console.log('useUserPosition: テストユーザーのため、築地の位置情報を使用します。');
        setUserPosition(tsukijiPosition);
        setIsLoading(false);
        setIsPositionResolved(true);
        return;
      }

      // テストユーザーでない場合は通常の位置情報取得
      if (!navigator.geolocation) {
        setError('このブラウザは位置情報取得に対応していません。');
        setIsLoading(false);
        setIsPositionResolved(true);
        return;
      }

      console.log('useUserPosition: 位置情報取得開始...');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: Position = [position.coords.latitude, position.coords.longitude];
          console.log(`useUserPosition: 現在地取得: [${coords[0]}, ${coords[1]}]`);
          setUserPosition(coords);
          setIsLoading(false);
          setIsPositionResolved(true);
          console.log('useUserPosition: 位置情報取得完了');
        },
        (error) => {
          console.log('useUserPosition: 位置情報取得失敗:', error.message);
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
    };

    initializePosition();
  }, []);

  return { userPosition, isLoading, error, isPositionResolved, isTestUser };
} 