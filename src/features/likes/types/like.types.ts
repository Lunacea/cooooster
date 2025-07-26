/**
 * いいね機能の型定義
 */

// いいねの状態
export type LikeState = {
  isLiked: boolean;
  likeCount: number;
};

// いいね操作のリクエスト
export type LikeRequest = {
  userId: string;
  postId: string;
};

// いいね数の取得レスポンス
export type LikeCountResponse = {
  count: number;
};