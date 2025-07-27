'use client'

import { useMap } from 'react-leaflet'
import { Button } from '@/shared/components/ui/button'
import { RegionSelector } from '../RegionSelector'

interface MapControlsProps {
  selectedRegion: string | null
  onRegionChange: (regionName: string | null) => void
  onRegionCenterChange: (center: [number, number]) => void
}

export function MapControls({ selectedRegion, onRegionChange, onRegionCenterChange }: MapControlsProps) {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 z-9999">
      <div
        className="p-3 space-y-3"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* 拡大縮小ボタン */}
        <div className="flex flex-col gap-1 items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => map.zoomIn()}
            className="w-8 h-8 p-0"
          >
            <span className="text-lg font-bold">+</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => map.zoomOut()}
            className="w-8 h-8 p-0"
          >
            <span className="text-lg font-bold">−</span>
          </Button>
        </div>

        {/* 地方選択 */}
        <div>
          <RegionSelector
            currentRegion={selectedRegion}
            onRegionChange={onRegionChange}
            onRegionCenterChange={onRegionCenterChange}
          />
        </div>
      </div>
    </div>
  );
} 