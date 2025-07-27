'use client';

import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { getPins } from '../api/getPins';
import { PinCard } from './PinCard';
import type { Pin } from '../types/pin.types';

// デフォルトピンアイコン
const defaultPinIcon = new Icon({
  iconUrl: '/pin-icon.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// カスタムピンアイコンを作成する関数
const createCustomPinIcon = (imageUrl?: string) => {
  if (!imageUrl) {
    return defaultPinIcon;
  }

  return divIcon({
    className: 'custom-pin-icon',
    html: `
      <div class="pin-container">
        <div class="pin-image">
          <img src="${imageUrl}" alt="ピン画像" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" />
        </div>
        <div class="pin-shadow"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

interface PinMarkerProps {
  prefecture?: string;
  area?: string;
}

export function PinMarkers({ prefecture, area }: PinMarkerProps) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPins = async () => {
      setIsLoading(true);
      const result = await getPins(prefecture, area);

      if (result.success) {
        setPins(result.data || []);
      }

      setIsLoading(false);
    };

    fetchPins();
  }, [prefecture, area]);

  if (isLoading || pins.length === 0) {
    return null;
  }

  return (
    <>
      {pins.map((pin) => {
        const pinIcon = createCustomPinIcon(pin.image_url);

        return (
          <Marker
            key={pin.id}
            position={[pin.latitude, pin.longitude]}
            icon={pinIcon}
          >
            <Popup className="pin-popup">
              <div className="w-80 max-h-96 overflow-y-auto">
                <PinCard pin={pin} />
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
} 