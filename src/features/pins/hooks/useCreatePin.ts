import { useState } from 'react';
import { createPin } from '../api/createPin';
import { uploadImage } from '../../posts/api/uploadImage';
import type { CreatePinData, PinFormData, Pin } from '../types/pin.types';

export function useCreatePin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPinWithImage = async (
    formData: PinFormData,
    locationData: {
      latitude: number;
      longitude: number;
      prefecture_code: string;
      area_name: string;
      distance_to_coastline?: number;
    }
  ): Promise<{ success: boolean; data?: Pin; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      let imageUrl: string | undefined;

      // 画像がある場合はアップロード
      if (formData.image) {
        try {
          imageUrl = await uploadImage(formData.image);
        } catch (uploadError) {
          const errorMessage = uploadError instanceof Error ? uploadError.message : '画像のアップロードに失敗しました';
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      }

      // ピンデータを作成
      const pinData: CreatePinData = {
        title: formData.title,
        content: formData.content,
        image_url: imageUrl,
        ...locationData
      };

      // ピンを投稿
      const result = await createPin(pinData);
      
      if (!result.success) {
        setError(result.error || 'ピンの投稿に失敗しました');
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '予期しないエラーが発生しました';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPin: createPinWithImage,
    isLoading,
    error
  };
} 