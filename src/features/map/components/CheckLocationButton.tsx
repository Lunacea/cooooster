'use client'

import { Button } from '@/shared/components/ui/button'
import { NavigationIcon } from 'lucide-react'

interface CheckLocationButtonProps {
  onClick: () => void
  disabled: boolean
  isLoading: boolean
}

export function CheckLocationButton({ onClick, disabled, isLoading }: CheckLocationButtonProps) {
  return (
    <div className="absolute bottom-4 right-4 z-99">
      <Button
        onClick={onClick}
        disabled={disabled}
        className="shadow-lg"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="relative w-4 h-4">
              <svg className="w-full h-full animate-spin" viewBox="0 0 16 16">
                <g transform="translate(8, 8)">
                  <polygon points="0,-3 2.6,1.5 -2.6,1.5" fill="#0071b0" opacity="0.8" transform="rotate(0)" />
                  <polygon points="0,-3 2.6,1.5 -2.6,1.5" fill="#ff8811" opacity="0.6" transform="rotate(120)" />
                  <polygon points="0,-3 2.6,1.5 -2.6,1.5" fill="#9dd9d2" opacity="0.4" transform="rotate(240)" />
                </g>
              </svg>
            </div>
            処理中...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavigationIcon className="h-4 w-4" />
            位置チェック
          </div>
        )}
      </Button>
    </div>
  );
} 