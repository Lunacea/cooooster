import * as React from 'react';
import { Heart } from 'lucide-react';
import { useLike } from '@/features/likes/hooks/useLike';

type LikeCountProps = {
  postId: string;
  className?: string;
};

export function LikeCount({ postId, className }: LikeCountProps) {
  const { likeCount } = useLike(postId);

  if (likeCount === 0) return null;

  return (
    <div className={`flex items-center gap-1 text-sm text-muted-foreground ${className}`}>
      <Heart className="h-3 w-3 fill-current text-red-500" />
      <span>{likeCount}</span>
    </div>
  );
}