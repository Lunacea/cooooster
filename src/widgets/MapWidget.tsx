'use client'

import dynamic from 'next/dynamic'

const DynamicMap = dynamic(
  () => import('@/features/map/Map').then((mod) => ({ default: mod.Map })),
  {
    loading: () => <div className="w-full h-full flex items-center justify-center">地図を読み込み中...</div>,
    ssr: false
  }
)

export function MapWidget() {
  return <DynamicMap />
} 