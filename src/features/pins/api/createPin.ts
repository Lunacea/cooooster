import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { CreatePinData, Pin } from '../types/pin.types';

export async function createPin(pinData: CreatePinData): Promise<{ success: boolean; data?: Pin; error?: string }> {
  try {
    const supabase = createClientComponentClient();
    
    // ユーザー認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: '認証が必要です' };
    }

    // アクセストークンを取得
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.access_token) {
      return { success: false, error: 'セッションが無効です' };
    }

    const response = await fetch('/api/pins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(pinData)
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'ピンの投稿に失敗しました' };
    }

    return { success: true, data: result.pin };

  } catch (error) {
    console.error('ピン投稿エラー:', error);
    return { success: false, error: 'サーバーエラーが発生しました' };
  }
} 