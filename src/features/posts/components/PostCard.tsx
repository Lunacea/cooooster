import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { LikeButton } from '@/features/likes/components/LikeButton';
import type { Post } from '@/features/posts/types/post.types';

type PostCardProps = {
  post: Post;
  currentUserId?: string;
};

export function PostCard({ post, currentUserId }: PostCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {post.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-sm">
              {post.user?.name || '不明なユーザー'}
            </div>
            <div className="text-xs text-muted-foreground">
              {post.area} • {formatDate(post.createdAt)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {post.imageUrl && (
            <div className="rounded-md overflow-hidden">
              <Image
                src={post.imageUrl}
                alt="投稿画像"
                width={600}
                height={400}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}

          <div className="flex items-center pt-2">
            <LikeButton
              postId={post.id}
              userId={currentUserId}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}