import type { GetPostsResponse } from '../types/post.types';

/**
 * 投稿一覧を取得するAPI関数（Next.js API Routes使用）
 */
export const getPosts = async (
  limit: number = 20,
  offset: number = 0
): Promise<GetPostsResponse> => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(`/api/posts?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('投稿取得エラー:', error);
    throw new Error('投稿の取得に失敗しました');
  }
};

/**
 * 特定ユーザーの投稿を取得
 */
export const getPostsByUser = async (
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<GetPostsResponse> => {
  try {
    const params = new URLSearchParams({
      userId,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(`/api/posts?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('ユーザー投稿取得エラー:', error);
    throw new Error('ユーザーの投稿取得に失敗しました');
  }
};