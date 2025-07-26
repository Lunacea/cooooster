import type { AreaLocation } from '@/shared/types/location.types';

/**
 * 投稿関連の型定義
 */

// 投稿フォームの入力データ
export type PostFormData = {
  content: string;
  area: string;
  latitude: number | null;
  longitude: number | null;
  image?: File;
};

// データベースから取得する投稿データ
export type Post = {
  id: string;
  userId: string;
  area: string;
  content: string;
  imageUrl?: string;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
  };
};

// 投稿作成時のリクエストデータ
export type CreatePostRequest = {
  content: string;
  area: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
};

// 投稿一覧取得時のレスポンス
export type GetPostsResponse = {
  posts: Post[];
  total: number;
};