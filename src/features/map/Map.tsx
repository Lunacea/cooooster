'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon, LatLngExpression, Layer, Path } from 'leaflet'
import * as turf from '@turf/turf'
import type { Feature, Polygon, MultiPolygon } from 'geojson'
import { MAP_CONFIG, TILE_LAYER } from '@/shared/libs/mapConfig'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useMapData } from './useMapData'
import { useUserPosition } from './useUserPosition'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { NavigationIcon } from 'lucide-react'

// マーカーアイコン設定
const defaultIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 地図ビュー変更コンポーネント
function ChangeView({ center, zoom }: { center: LatLngExpression, zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// 境界線のスタイル設定
const boundaryStyles = {
  default: {
    color: '#22c55e', // 緑色（境界線）
    weight: 1,
    opacity: 0.6,
    fillColor: 'transparent', // 塗りつぶしなし
    fillOpacity: 0
  },
  collected: {
    color: '#059669', // 濃い緑色（コレクション済み）
    weight: 2,
    opacity: 0.8,
    fillColor: '#059669',
    fillOpacity: 0.2
  },
  coastline: {
    color: '#0ea5e9', // 青色（海岸線）
    weight: 2,
    opacity: 0.8,
    fillColor: 'transparent',
    fillOpacity: 0
  }
} as const;

// ステータスメッセージコンポーネント
const StatusMessage = ({ message }: { message: string }) => (
  <div className="absolute bottom-4 left-4 z-[99] max-w-md">
    <Card className="shadow-lg">
      <CardContent className="p-3">
        <p className="text-sm text-gray-700">{message}</p>
      </CardContent>
    </Card>
  </div>
);

// 位置チェックボタン
const CheckLocationButton = ({ onClick, disabled, isLoading }: { onClick: () => void; disabled: boolean; isLoading: boolean }) => (
  <div className="absolute bottom-4 right-4 z-[99]">
    <Button
      onClick={onClick}
      disabled={disabled}
      className="shadow-lg"
      size="lg"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          処理中...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <NavigationIcon className="h-4 w-4" />
          位置チェック
        </div>
      )}
    </Button>
  </div>
);

// 拡大縮小ボタンコンポーネント
const ZoomControls = () => {
  const map = useMap();

  return (
    <div className="absolute top-24 right-4 z-[99]">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-1">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => map.zoomIn()}
            className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-bold text-gray-600">+</span>
          </button>
          <button
            onClick={() => map.zoomOut()}
            className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-bold text-gray-600">−</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export function Map({ selectedRegion: externalSelectedRegion, mapCenter: externalMapCenter }: { selectedRegion?: string | null; mapCenter?: [number, number] | null }) {
  const supabase = createClientComponentClient()
  const { userPosition, isLoading: positionLoading, isPositionResolved } = useUserPosition()
  const [message, setMessage] = useState<string>('現在地を取得しています...')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
  const { boundaries, coastline, collectedAreas, isLoading: dataLoading, error: dataError, setCollectedAreas, isUsingSampleData } = useMapData(userPosition, selectedRegion, isPositionResolved)
  const isLoading = positionLoading || dataLoading

  // 外部からの地方選択を反映
  useEffect(() => {
    if (externalSelectedRegion !== undefined) {
      setSelectedRegion(externalSelectedRegion)
    }
  }, [externalSelectedRegion])

  // 外部からの地図中心を反映
  useEffect(() => {
    if (externalMapCenter !== undefined) {
      setMapCenter(externalMapCenter)
    }
  }, [externalMapCenter])

  // データエラーがある場合のメッセージ更新
  useEffect(() => {
    if (dataError) {
      setMessage(`データ読み込みエラー: ${dataError}`);
    }
  }, [dataError]);

  // サンプルデータ使用時のメッセージ更新
  useEffect(() => {
    if (isUsingSampleData) {
      setMessage('サンプルデータを使用しています。実際の地図データをアップロードしてください。');
    }
  }, [isUsingSampleData]);

  // 位置チェック処理
  const handleCheckLocation = useCallback(async () => {
    if (!userPosition || !boundaries || !coastline || !coastline.geometry) {
      setMessage('データがまだ準備できていません。');
      return;
    }

    // サンプルデータの場合は特別な処理
    if (isUsingSampleData) {
      setMessage('サンプルデータのため、コレクション機能は無効です。');
      return;
    }

    const userPoint = turf.point([userPosition[1], userPosition[0]]);
    let currentMunicipality: string | null = null;

    // 現在の市町村を特定
    for (const feature of boundaries.features) {
      if (turf.booleanPointInPolygon(userPoint, feature as Feature<Polygon | MultiPolygon>)) {
        currentMunicipality = feature.properties?.name;
        break;
      }
    }

    if (!currentMunicipality) {
      setMessage('海岸のある市町村・エリア内にいません。');
      return;
    }

    if (collectedAreas.has(currentMunicipality)) {
      setMessage(`【${currentMunicipality}】はすでにコレクション済みです！`);
      return;
    }

    // 海岸線までの最短距離を計算
    let minDistance = Infinity;
    for (const lineSegment of coastline.geometry.coordinates) {
      const line = turf.lineString(lineSegment);
      const distance = turf.pointToLineDistance(userPoint, line, { units: 'kilometers' });
      if (distance < minDistance) minDistance = distance;
    }

    if (minDistance <= 1) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setMessage('コレクションを保存するにはログインが必要です。');
          return;
        }
        const { error } = await supabase.from('collected_areas').insert({ user_id: user.id, area_name: currentMunicipality });
        if (error) throw error;
        setCollectedAreas(prev => new Set(prev).add(currentMunicipality!));
        setMessage(`🎉【${currentMunicipality}】の海岸線をコレクションしました！`);
      } catch (error) {
        console.error('コレクションの保存に失敗しました:', error);
        setMessage('コレクションの保存に失敗しました。');
      }
    } else {
      setMessage(`【${currentMunicipality}】にいますが、海岸線から遠いようです。`);
    }
  }, [userPosition, boundaries, coastline, collectedAreas, setCollectedAreas, isUsingSampleData, supabase]);

  // 境界線のスタイル設定
  const onEachFeature = useCallback((feature: Feature, layer: Layer) => {
    const areaName = feature.properties?.name || '名前のないエリア';
    layer.bindTooltip(areaName);
    const isCollected = collectedAreas.has(areaName);

    // コレクション済みの場合のみ塗りつぶしを表示
    if (isCollected) {
      (layer as Path).setStyle(boundaryStyles.collected);
    } else {
      (layer as Path).setStyle(boundaryStyles.default);
    }
  }, [collectedAreas]);

  // 地図の中心座標を決定（メモ化）
  const positionToDisplay = useMemo(() => {
    return mapCenter || userPosition || MAP_CONFIG.DEFAULT_CENTER;
  }, [mapCenter, userPosition]);

  // クライアントサイドでない場合はローディング表示
  if (!isPositionResolved) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bice-blue mx-auto mb-4"></div>
          <p className="text-gray-600">現在地を取得中...</p>
          <p className="text-sm text-gray-500 mt-2">位置情報の許可をお願いします</p>
        </div>
      </div>
    );
  }

  // データエラーがある場合はエラーメッセージを表示
  if (dataError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">データ読み込みエラー</h2>
          <p className="text-gray-600 mb-4">{dataError}</p>
          <p className="text-sm text-gray-500">
            Supabase Storageに地図データがアップロードされているか確認してください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* サンプルデータ使用時の警告表示 */}
      {isUsingSampleData && (
        <div className="absolute top-4 left-4 right-4 z-[99]">
          <Card className="shadow-lg border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    サンプルデータを表示中
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    実際の地図データをアップロードしてください。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <MapContainer
        center={positionToDisplay}
        zoom={userPosition ? 9 : MAP_CONFIG.DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        {userPosition && <ChangeView center={userPosition} zoom={9} />}
        <ZoomControls />
        <TileLayer
          attribution={TILE_LAYER.attribution}
          url={TILE_LAYER.url}
        />
        {userPosition && (
          <Marker position={userPosition} icon={defaultIcon}>
            <Popup>あなたの現在地</Popup>
          </Marker>
        )}
        {coastline && (
          <GeoJSON
            data={coastline}
            style={boundaryStyles.coastline}
          />
        )}
        {boundaries && (
          <GeoJSON
            key={JSON.stringify(Array.from(collectedAreas))}
            data={boundaries}
            style={boundaryStyles.default}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      <CheckLocationButton
        onClick={handleCheckLocation}
        disabled={isLoading || !userPosition || !boundaries || isUsingSampleData}
        isLoading={isLoading}
      />

      <StatusMessage message={message} />
    </div>
  )
}
