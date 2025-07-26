'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'
import { MAP_CONFIG, TILE_LAYER } from '@/shared/libs/mapConfig'

// マーカーアイコンの修正（react-leafletの既知の問題対応）
const defaultIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export function Map() {
  // 盛岡の座標を初期位置に設定
  const position: [number, number] = MAP_CONFIG.DEFAULT_CENTER

  return (
    <div className="w-full h-full">
      <MapContainer 
        center={position} 
        zoom={MAP_CONFIG.DEFAULT_ZOOM} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution={TILE_LAYER.attribution}
          url={TILE_LAYER.url}
        />
        <Marker position={position} icon={defaultIcon}>
          <Popup>
            現在地 🗾
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
} 
