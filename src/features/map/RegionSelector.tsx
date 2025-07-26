'use client'

import { useState } from 'react';
import { getAvailableRegions } from '@/shared/libs/prefectureUtils';

interface RegionSelectorProps {
  currentRegion: string | null;
  onRegionChange: (regionName: string | null) => void;
  onRegionCenterChange?: (center: [number, number]) => void;
}

// 地方の中心座標
const REGION_CENTERS: Record<string, [number, number]> = {
  '北海道・東北': [40.5, 141.0],
  '関東': [35.7, 139.7],
  '中部': [36.5, 137.5],
  '近畿': [34.7, 135.5],
  '中国': [35.0, 133.5],
  '四国': [33.5, 133.5],
  '九州・沖縄': [32.5, 131.0]
};

export function RegionSelector({ currentRegion, onRegionChange, onRegionCenterChange }: RegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const regions = getAvailableRegions();

  const handleRegionChange = (regionName: string | null) => {
    onRegionChange(regionName);

    // 地方の中心座標を設定
    if (regionName && onRegionCenterChange) {
      const center = REGION_CENTERS[regionName];
      if (center) {
        onRegionCenterChange(center);
        console.log(`地方「${regionName}」の中心座標に変更: [${center[0]}, ${center[1]}]`);
      }
    }

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md text-sm font-medium text-gray-800 hover:bg-opacity-100 transition-all"
      >
        🌊 {currentRegion || '地方選択'}
        <span className="ml-2">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border max-h-60 overflow-y-auto z-[1001] min-w-48">
          <button
            onClick={() => handleRegionChange(null)}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${currentRegion === null ? 'bg-blue-50 text-blue-600' : ''
              }`}
          >
            自動選択
          </button>
          {regions.map((region) => (
            <button
              key={region.name}
              onClick={() => handleRegionChange(region.name)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${region.name === currentRegion ? 'bg-blue-50 text-blue-600' : ''
                }`}
            >
              {region.name}
              <div className="text-xs text-gray-500 mt-1">
                {region.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 