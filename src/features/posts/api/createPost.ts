import type { CreatePostRequest } from '../types/post.types';

/**
 * 投稿を作成するAPI関数（Next.js API Routes使用）
 */
export const createPost = async (
  postData: CreatePostRequest,
  userId: string
): Promise<{ id: string }> => {
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        area: postData.area,
        content: postData.content,
        imageUrl: postData.imageUrl,
        latitude: postData.latitude,
        longitude: postData.longitude,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { id: result.id };
  } catch (error) {
    console.error('投稿作成エラー:', error);
    throw new Error('投稿の作成に失敗しました');
  }
};