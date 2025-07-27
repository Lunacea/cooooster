'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'

interface ChangeViewProps {
  center: LatLngExpression
  zoom: number
}

export function ChangeView({ center, zoom }: ChangeViewProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
} 