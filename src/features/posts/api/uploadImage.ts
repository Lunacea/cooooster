/**
 * 画像アップロードAPI関数（Supabase Storage用）
 */

// 画像をアップロードしてURLを返す
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // 実際の実装では Supabase Storage を使用
    // ここでは簡易的な実装
    const formData = new FormData();
    formData.append('file', file);

    // 仮のアップロード処理
    // 実際はSupabaseのAPIエンドポイントを呼び出し
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('画像のアップロードに失敗しました');
    }

    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error('画像アップロードエラー:', error);
    throw new Error('画像のアップロードに失敗しました');
  }
};