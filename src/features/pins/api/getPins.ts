import type { Pin } from '../types/pin.types';

export async function getPins(prefecture?: string, area?: string): Promise<{ success: boolean; data?: Pin[]; error?: string }> {
  try {
    const params = new URLSearchParams();
    if (prefecture) params.append('prefecture', prefecture);
    if (area) params.append('area', area);

    const response = await fetch(`/api/pins?${params.toString()}`);
    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'ピンの取得に失敗しました' };
    }

    return { success: true, data: result.pins };

  } catch (error) {
    console.error('ピン取得エラー:', error);
    return { success: false, error: 'サーバーエラーが発生しました' };
  }
} 