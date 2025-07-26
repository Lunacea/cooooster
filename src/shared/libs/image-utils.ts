/**
 * 画像処理のユーティリティ関数
 */

// ファイルサイズを MB 単位で取得
export const getFileSizeInMB = (file: File): number => {
  return file.size / (1024 * 1024);
};

// 画像ファイルかどうかを判定
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

// ファイル名を安全な形式に変換
export const generateSafeFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop() || '';
  return `image_${timestamp}.${extension}`;
};

// 画像ファイルのバリデーション
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!isImageFile(file)) {
    return { valid: false, error: '画像ファイルを選択してください' };
  }

  if (getFileSizeInMB(file) > 5) {
    return { valid: false, error: 'ファイルサイズは5MB以下にしてください' };
  }

  return { valid: true };
};