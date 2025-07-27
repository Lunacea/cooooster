'use client'

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getAvailableRegions } from '@/shared/libs/prefectureUtils';
import { Button } from '@/shared/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const regions = getAvailableRegions();

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

  // ドロップダウンの位置を計算
  const getDropdownPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0, width: 0 };

    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = 192; // min-w-48 = 12rem = 192px
    const windowWidth = window.innerWidth;

    // 右側にはみ出るかチェック
    const wouldOverflowRight = rect.left + dropdownWidth > windowWidth;

    let left = rect.left;
    if (wouldOverflowRight) {
      // 右側にはみ出る場合は左側に表示
      left = Math.max(0, windowWidth - dropdownWidth - 16); // 16pxのマージン
    }

    return {
      top: rect.bottom + window.scrollY,
      left: left + window.scrollX,
      width: rect.width
    };
  };

  const dropdownPosition = getDropdownPosition();

  return (
    <>
      <Button
        ref={buttonRef}
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full justify-between"
      >
        <span>{currentRegion || '地方選択'}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </Button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed bg-white rounded-lg shadow-lg border max-h-60 overflow-y-auto z-[9999] w-48"
          style={{
            '--dropdown-top': `${dropdownPosition.top}px`,
            '--dropdown-left': `${dropdownPosition.left}px`,
            top: 'var(--dropdown-top)',
            left: 'var(--dropdown-left)'
          } as React.CSSProperties}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onScroll={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRegionChange(null);
            }}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${currentRegion === null ? 'bg-blue-50 text-blue-600' : ''
              }`}
          >
            自動選択
          </button>
          {regions.map((region) => (
            <button
              key={region.name}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRegionChange(region.name);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${region.name === currentRegion ? 'bg-blue-50 text-blue-600' : ''
                }`}
            >
              {region.name}
              <div className="text-xs text-gray-500 mt-1">
                {region.description}
              </div>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
} 