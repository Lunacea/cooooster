import { useState, useEffect, useCallback } from 'react';
import { getPosts, getPostsByUser } from '@/features/posts/api/getPosts';
import type { Post } from '@/features/posts/types/post.types';

/**
 * 投稿一覧取得のカスタムフック
 */
export const usePosts = (userId?: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = userId 
        ? await getPostsByUser(userId)
        : await getPosts();
      
      setPosts(result.posts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '投稿の取得に失敗しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refresh = () => {
    fetchPosts();
  };

  return {
    posts,
    loading,
    error,
    refresh,
  };
};