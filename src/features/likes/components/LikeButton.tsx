import * as React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/shared/libs/utils';
import { useLike } from '@/features/likes/hooks/useLike';

type LikeButtonProps = {
  postId: string;
  userId?: string;
  className?: string;
};

export function LikeButton({ postId, userId, className }: LikeButtonProps) {
  const { isLiked, likeCount, loading, handleToggle } = useLike(postId, userId);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={!userId || loading}
      className={cn(
        'flex items-center gap-1 text-muted-foreground hover:text-red-500',
        isLiked && 'text-red-500',
        className
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all',
          isLiked && 'fill-current text-red-500'
        )}
      />
      <span className="text-sm">{likeCount}</span>
    </Button>
  );
}