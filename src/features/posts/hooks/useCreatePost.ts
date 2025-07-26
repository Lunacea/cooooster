import { useState } from 'react';
import { createPost } from '@/features/posts/api/createPost';
import { uploadImage } from '@/features/posts/api/uploadImage';
import type { PostFormData } from '@/features/posts/types/post.types';

/**
 * 投稿作成のカスタムフック
 */
export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    formData: PostFormData,
    userId: string
  ): Promise<{ success: boolean; postId?: string }> => {
    setLoading(true);
    setError(null);

    try {
      let imageUrl: string | undefined;

      // 画像がある場合はアップロード
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      // 投稿を作成
      const result = await createPost(
        {
          content: formData.content,
          area: formData.area,
          latitude: formData.latitude || 0,
          longitude: formData.longitude || 0,
          imageUrl,
        },
        userId
      );

      return { success: true, postId: result.id };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '投稿に失敗しました';
      setError(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    submit,
    loading,
    error,
  };
};