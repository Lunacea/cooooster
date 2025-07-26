'use client'

import { useState } from 'react'
import { MapWidget } from '@/widgets/MapWidget'
import Menu from '@/shared/components/layouts/Menu'

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)

  const handleRegionChange = (regionName: string | null) => {
    setSelectedRegion(regionName)
    console.log(`地方を変更: ${regionName || '自動選択'}`)
  }

  const handleRegionCenterChange = (center: [number, number]) => {
    setMapCenter(center)
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* Map */}
      <div className="w-full h-full">
        <MapWidget selectedRegion={selectedRegion} mapCenter={mapCenter} />
      </div>

      {/* Menu */}
      <div className="absolute bottom-4 left-4 right-4 z-[9999]">
        <Menu
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
          onRegionCenterChange={handleRegionCenterChange}
        />
      </div>
    </div>
  );
}
