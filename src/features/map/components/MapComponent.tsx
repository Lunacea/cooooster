"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  coastlineDataPath?: string;
}

// マップの中心座標を更新するコンポーネント
function MapUpdater({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom());
  }, [map, latitude, longitude]);
  
  return null;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  latitude, 
  longitude, 
  zoom = 15,
  coastlineDataPath 
}) => {
  const [coastlineData, setCoastlineData] = useState<[number, number][]>([]);

  useEffect(() => {
    if (coastlineDataPath) {
      fetch(coastlineDataPath)
        .then(res => res.json())
        .then(data => {
          const positions = data.map((point: {lat: number, lon: number}) => [point.lat, point.lon] as [number, number]);
          setCoastlineData(positions);
        })
        .catch(err => console.error('Failed to load coastline data:', err));
    }
  }, [coastlineDataPath]);
  return (
    <div className="h-[500px] w-full">
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coastlineData.length > 0 && (
          <Polyline positions={coastlineData} color="#808080" weight={3} />
        )}
        <Marker position={[latitude, longitude]}>
          <Popup>
            <div className="text-center">
              <strong className="text-gray-800">現在地</strong><br />
              <span className="text-sm text-gray-600">
                緯度: {latitude.toFixed(6)}<br />
                経度: {longitude.toFixed(6)}
              </span>
            </div>
          </Popup>
        </Marker>
        <MapUpdater latitude={latitude} longitude={longitude} />
      </MapContainer>
    </div>
  );
}; 