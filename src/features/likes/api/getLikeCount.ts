/**
 * 投稿のいいね数を取得（Next.js API Routes使用）
 */
export const getLikeCount = async (postId: string): Promise<number> => {
  try {
    const params = new URLSearchParams({ postId });
    const response = await fetch(`/api/likes?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.likeCount || 0;
  } catch (error) {
    console.error('いいね数取得エラー:', error);
    return 0;
  }
};

/**
 * ユーザーがいいね済みかチェック（Next.js API Routes使用）
 */
export const checkUserLiked = async (
  userId: string,
  postId: string
): Promise<boolean> => {
  try {
    const params = new URLSearchParams({ postId, userId });
    const response = await fetch(`/api/likes?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.isLiked || false;
  } catch (error) {
    console.error('いいね状態チェックエラー:', error);
    return false;
  }
};