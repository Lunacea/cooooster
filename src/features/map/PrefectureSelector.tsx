'use client'

import { useState } from 'react';
import { getAvailablePrefectures, getPrefectureName } from '@/shared/libs/prefectureUtils';

interface PrefectureSelectorProps {
  currentPrefecture: string;
  onPrefectureChange: (prefectureCode: string) => void;
}

export function PrefectureSelector({ currentPrefecture, onPrefectureChange }: PrefectureSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const prefectures = getAvailablePrefectures();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md text-sm font-medium text-gray-800 hover:bg-opacity-100 transition-all"
      >
        📍 {getPrefectureName(currentPrefecture)}
        <span className="ml-2">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border max-h-60 overflow-y-auto z-99 min-w-48">
          {prefectures.map((prefecture) => (
            <button
              key={prefecture.code}
              onClick={() => {
                onPrefectureChange(prefecture.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${prefecture.code === currentPrefecture ? 'bg-blue-50 text-blue-600' : ''
                }`}
            >
              {prefecture.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 