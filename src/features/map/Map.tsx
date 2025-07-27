'use client'

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Layer, Path } from 'leaflet'
import * as turf from '@turf/turf'
import type { Feature, Polygon, MultiPolygon } from 'geojson'
import { MAP_CONFIG, TILE_LAYER } from '@/shared/libs/mapConfig'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useMapData } from './useMapData'
import { useUserPosition } from './useUserPosition'
import {
  ChangeView,
  StatusMessage,
  CheckLocationButton,
  MapControls,
  SampleDataWarning,
  LoadingSpinner,
  ErrorDisplay,
  AutoCollectionStatus
} from './components'
import { boundaryStyles, defaultIcon } from './constants'

export function Map({ selectedRegion: externalSelectedRegion, mapCenter: externalMapCenter }: { selectedRegion?: string | null; mapCenter?: [number, number] | null }) {
  const supabase = createClientComponentClient()
  const { userPosition, isLoading: positionLoading, isPositionResolved } = useUserPosition()
  const [message, setMessage] = useState<string>('現在地を取得しています...')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)
  const [showMap, setShowMap] = useState(false)
  const { boundaries, coastline, collectedAreas, isLoading: dataLoading, error: dataError, setCollectedAreas, isUsingSampleData } = useMapData(userPosition, selectedRegion, isPositionResolved)
  const isLoading = positionLoading || dataLoading

  // 自動コレクション用の状態
  const [isAutoCollecting, setIsAutoCollecting] = useState(false)
  const lastCheckedPosition = useRef<[number, number] | null>(null)
  const autoCollectionInterval = useRef<NodeJS.Timeout | null>(null)

  // 地方選択のハンドラー
  const handleRegionChange = (regionName: string | null) => {
    setSelectedRegion(regionName)
    if (regionName) {
      setMessage(`${regionName}の地図データを読み込み中...`)
    }
  }

  // 地方の中心座標変更のハンドラー
  const handleRegionCenterChange = (center: [number, number]) => {
    setMapCenter(center)
  }

  // 自動コレクション処理
  const performAutoCollection = useCallback(async () => {
    if (!userPosition || !boundaries || !coastline || !coastline.geometry || isUsingSampleData) {
      return;
    }

    // 位置が変わっていない場合はスキップ
    if (lastCheckedPosition.current &&
      Math.abs(lastCheckedPosition.current[0] - userPosition[0]) < 0.001 &&
      Math.abs(lastCheckedPosition.current[1] - userPosition[1]) < 0.001) {
      return;
    }

    lastCheckedPosition.current = userPosition;

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
      return;
    }

    if (collectedAreas.has(currentMunicipality)) {
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
          return;
        }

        const { error } = await supabase.from('collected_areas').insert({
          user_id: user.id,
          area_name: currentMunicipality
        });

        if (error) {
          console.error('自動コレクションエラー:', error);
          return;
        }

        setCollectedAreas(prev => new Set(prev).add(currentMunicipality!));
        setMessage(`🎉【${currentMunicipality}】の海岸線を自動コレクションしました！`);

        // 成功メッセージを3秒後にクリア
        setTimeout(() => {
          setMessage('位置情報を監視中...');
        }, 3000);
      } catch (error) {
        console.error('自動コレクションの保存に失敗しました:', error);
      }
    }
  }, [userPosition, boundaries, coastline, collectedAreas, setCollectedAreas, isUsingSampleData, supabase]);

  // 自動コレクションの開始/停止
  useEffect(() => {
    if (userPosition && boundaries && coastline && !isUsingSampleData && !isLoading) {
      setIsAutoCollecting(true);
      setMessage('位置情報を監視中...');

      // 初回チェック
      performAutoCollection();

      // 30秒間隔で自動チェック
      autoCollectionInterval.current = setInterval(performAutoCollection, 30000);

      return () => {
        if (autoCollectionInterval.current) {
          clearInterval(autoCollectionInterval.current);
          autoCollectionInterval.current = null;
        }
      };
    } else {
      setIsAutoCollecting(false);
      if (autoCollectionInterval.current) {
        clearInterval(autoCollectionInterval.current);
        autoCollectionInterval.current = null;
      }
    }
  }, [userPosition, boundaries, coastline, isUsingSampleData, isLoading, performAutoCollection]);

  // 地図表示の制御
  useEffect(() => {
    if (!isLoading && !dataError && boundaries && coastline) {
      const timer = setTimeout(() => {
        setShowMap(true)
      }, 300) // ローディング終了後少し遅延してから地図を表示
      return () => clearTimeout(timer)
    } else {
      setShowMap(false)
    }
  }, [isLoading, dataError, boundaries, coastline])

  // 外部からの地方選択を反映
  useEffect(() => {
    if (externalSelectedRegion !== undefined) {
      setSelectedRegion(externalSelectedRegion)
      if (externalSelectedRegion) {
        setMessage(`${externalSelectedRegion}の地図データを読み込み中...`)
      }
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

  // 手動位置チェック処理（バックアップ用）
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

        // データベースエラーの詳細なハンドリング
        const { error } = await supabase.from('collected_areas').insert({
          user_id: user.id,
          area_name: currentMunicipality
        });

        if (error) {
          console.error('データベースエラー:', error);
          if (error.code === '42P01') {
            setMessage('データベーステーブルが存在しません。管理者に連絡してください。');
          } else if (error.code === '23505') {
            setMessage(`【${currentMunicipality}】は既にコレクション済みです。`);
          } else {
            setMessage('コレクションの保存に失敗しました。');
          }
          return;
        }

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
      <LoadingSpinner
        title="現在地を取得中..."
        subtitle="位置情報の許可をお願いします"
        size="sm"
      />
    );
  }

  // データ読み込み中の場合はローディング表示
  if (isLoading) {
    return (
      <LoadingSpinner
        title="地図データを読み込み中..."
        subtitle="しばらくお待ちください"
        size="md"
      />
    );
  }

  // データエラーがある場合はエラーメッセージを表示
  if (dataError) {
    return <ErrorDisplay error={dataError} />;
  }

  return (
    <div className="w-full h-full relative">
      {showMap && (
        <div className="w-full h-full animate-in fade-in duration-700">
          {/* サンプルデータ使用時の警告表示 */}
          <SampleDataWarning isUsingSampleData={isUsingSampleData} />

          {/* 自動コレクション状態表示 */}
          <AutoCollectionStatus
            isActive={isAutoCollecting}
            isCollecting={isAutoCollecting}
          />

          <MapContainer
            center={positionToDisplay}
            zoom={userPosition ? 9 : MAP_CONFIG.DEFAULT_ZOOM}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            zoomControl={false}
          >
            <ChangeView center={positionToDisplay} zoom={userPosition ? 9 : MAP_CONFIG.DEFAULT_ZOOM} />
            <MapControls
              selectedRegion={selectedRegion}
              onRegionChange={handleRegionChange}
              onRegionCenterChange={handleRegionCenterChange}
            />
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

          {/* 自動コレクションが無効な場合のみ手動ボタンを表示 */}
          {!isAutoCollecting && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 delay-500">
              <CheckLocationButton
                onClick={handleCheckLocation}
                disabled={isLoading || !userPosition || !boundaries || isUsingSampleData}
                isLoading={isLoading}
              />
            </div>
          )}

          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-600">
            <StatusMessage
              message={message}
              type={
                message.includes('🎉') ? 'success' :
                  message.includes('エラー') || message.includes('失敗') ? 'error' :
                    message.includes('サンプルデータ') ? 'warning' :
                      'default'
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}
