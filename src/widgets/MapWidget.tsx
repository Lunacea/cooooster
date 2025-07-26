'use client'

import dynamic from 'next/dynamic'

const DynamicMap = dynamic(
  () => import('@/features/map/Map').then((mod) => ({ default: mod.Map })),
  {
    loading: () => <div className="w-full h-full flex items-center justify-center">地図を読み込み中...</div>,
    ssr: false
  }
)

interface MapWidgetProps {
  selectedRegion?: string | null;
  mapCenter?: [number, number] | null;
}

export function MapWidget({ selectedRegion, mapCenter }: MapWidgetProps) {
  return <DynamicMap selectedRegion={selectedRegion} mapCenter={mapCenter} />
}
