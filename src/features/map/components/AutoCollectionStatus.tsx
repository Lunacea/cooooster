'use client'

import { Badge } from '@/shared/components/ui/badge'
import { CheckCircle, Clock } from 'lucide-react'

interface AutoCollectionStatusProps {
  isActive: boolean
  isCollecting: boolean
}

export function AutoCollectionStatus({ isActive, isCollecting }: AutoCollectionStatusProps) {
  if (!isActive) {
    return null;
  }

  return (
    <div className="absolute top-20 left-4 z-99">
      <Badge
        variant={isCollecting ? "default" : "secondary"}
        className="flex items-center gap-2 shadow-lg"
      >
        {isCollecting ? (
          <>
            <CheckCircle className="h-3 w-3" />
            自動コレクション有効
          </>
        ) : (
          <>
            <Clock className="h-3 w-3" />
            監視中...
          </>
        )}
      </Badge>
    </div>
  );
} 