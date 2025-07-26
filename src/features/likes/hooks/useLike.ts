import { useState, useEffect } from 'react';
import { toggleLike } from '@/features/likes/api/toggleLike';
import { getLikeCount, checkUserLiked } from '@/features/likes/api/getLikeCount';

/**
 * いいね機能のカスタムフック
 */
export const useLike = (postId: string, userId?: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 初期データを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [count, liked] = await Promise.all([
          getLikeCount(postId),
          userId ? checkUserLiked(userId, postId) : false,
        ]);
        
        setLikeCount(count);
        setIsLiked(liked);
      } catch (error) {
        console.error('いいねデータ取得エラー:', error);
      }
    };

    fetchData();
  }, [postId, userId]);

  // いいねの切り替え
  const handleToggle = async () => {
    if (!userId || loading) return;

    setLoading(true);
    try {
      const result = await toggleLike(userId, postId);
      
      setIsLiked(result.isLiked);
      setLikeCount(prev => result.isLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('いいね操作エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLiked,
    likeCount,
    loading,
    handleToggle,
  };
};