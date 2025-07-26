'use client';

import { PostCreator } from '@/widgets/PostCreator';

/**
 * 投稿とイイネ機能を統合したページ
 */
export default function PostLikePage() {
  // 仮のユーザーID（実際の実装では認証システムから取得）
  const currentUserId = 'user-123';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">海岸線コミュニティ</h1>
            <p className="text-muted-foreground">
              お気に入りの海岸線を投稿して、みんなとシェアしよう！
            </p>
          </div>
          
          <PostCreator userId={currentUserId} />
        </div>
      </div>
    </div>
  );
}