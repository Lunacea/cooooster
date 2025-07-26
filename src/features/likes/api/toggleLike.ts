/**
 * いいねのON/OFF切り替え（Next.js API Routes使用）
 */
export const toggleLike = async (
  userId: string,
  postId: string
): Promise<{ isLiked: boolean }> => {
  try {
    const response = await fetch('/api/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        postId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { isLiked: result.isLiked };
  } catch (error) {
    console.error('いいね操作エラー:', error);
    throw new Error('いいね操作に失敗しました');
  }
};