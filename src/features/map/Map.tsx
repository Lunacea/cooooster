'use client'

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
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
import { PinMarkers } from '../pins/components/PinMarker'
import { PinForm } from '../pins/components/PinForm'

export function Map({
  selectedRegion: externalSelectedRegion,
  mapCenter: externalMapCenter,
  onPinButtonClick,
  onPinButtonDisabled
}: {
  selectedRegion?: string | null;
  mapCenter?: [number, number] | null;
  onPinButtonClick?: (callback: () => void) => void;
  onPinButtonDisabled?: (disabled: boolean) => void;
}) {
  const supabase = createClientComponentClient()
  const { userPosition, isLoading: positionLoading, isPositionResolved, isTestUser } = useUserPosition()
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

  // ピン投稿用の状態
  const [showPinForm, setShowPinForm] = useState(false)
  const [isClosingPinForm, setIsClosingPinForm] = useState(false)
  const [currentLocationData, setCurrentLocationData] = useState<{
    latitude: number;
    longitude: number;
    prefecture_code: string;
    area_name: string;
    distance_to_coastline?: number;
  } | null>(null)

  // 築地の位置情報（テスト用）
  const tsukijiPosition = useMemo((): [number, number] => [35.6654, 139.7704], []); // 築地市場付近

  // テストユーザーの場合の位置情報を取得
  const getEffectivePosition = useCallback(() => {
    if (isTestUser) {
      console.log('テストユーザー: 築地の位置情報を使用');
      return tsukijiPosition;
    }
    return userPosition;
  }, [isTestUser, userPosition, tsukijiPosition]);

  // ピン投稿ボタンのクリックハンドラー
  const handlePinButtonClick = useCallback(async () => {
    console.log('ピン投稿ボタンがクリックされました');

    const effectivePosition = getEffectivePosition();

    if (!effectivePosition || !boundaries || !coastline || !coastline.geometry) {
      setMessage('位置情報が取得できていません');
      return;
    }

    const userPoint = turf.point([effectivePosition[1], effectivePosition[0]]);
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

    let minDistance = 0.5; // デフォルト値

    // テストユーザーでない場合のみ距離計算を実行
    if (!isTestUser) {
      console.log('距離計算を開始します...');

      // 海岸線までの最短距離を計算（最適化版）
      minDistance = Infinity;
      const coordinates = coastline.geometry.coordinates;

      // 座標数を制限して計算時間を短縮
      const maxSegments = 50; // 最大50セグメントまで計算
      const step = Math.max(1, Math.floor(coordinates.length / maxSegments));

      for (let i = 0; i < coordinates.length; i += step) {
        const lineSegment = coordinates[i];
        if (lineSegment && lineSegment.length >= 2) {
          const line = turf.lineString(lineSegment);
          const distance = turf.pointToLineDistance(userPoint, line, { units: 'kilometers' });
          if (distance < minDistance) {
            minDistance = distance;
            // 十分に近い距離が見つかったら早期終了
            if (minDistance < 1) {
              console.log('早期終了: 十分に近い距離が見つかりました');
              break;
            }
          }
        }
      }

      if (minDistance > 5) {
        setMessage('海岸線から5km以内でのみピン投稿が可能です。');
        return;
      }
    } else {
      console.log('テストユーザー: 距離計算をスキップし、0.5kmに設定');
    }

    // 都道府県コードを取得
    const prefectureCode = getPrefectureFromPosition(effectivePosition);
    if (!prefectureCode) {
      setMessage('都道府県の特定に失敗しました。');
      return;
    }

    console.log('ピン投稿フォームを表示します');
    setCurrentLocationData({
      latitude: effectivePosition[0],
      longitude: effectivePosition[1],
      prefecture_code: prefectureCode,
      area_name: currentMunicipality,
      distance_to_coastline: minDistance
    });

    setShowPinForm(true);
  }, [getEffectivePosition, boundaries, coastline, setMessage, setCurrentLocationData, setShowPinForm, isTestUser]);

  // ピン投稿フォームを閉じる関数
  const closePinForm = () => {
    setIsClosingPinForm(true)
    setTimeout(() => {
      setShowPinForm(false)
      setCurrentLocationData(null)
      setIsClosingPinForm(false)
    }, 300)
  }

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

  // コンポーネント初期化時にコールバックを設定
  useEffect(() => {
    console.log('Map: Component initialized, setting up callbacks');
    if (onPinButtonClick) {
      console.log('Map: Initial setup - Setting handlePinButtonClick callback');
      onPinButtonClick(handlePinButtonClick);
    }
    if (onPinButtonDisabled) {
      const isDisabled = isLoading || !userPosition || !boundaries || isUsingSampleData;
      console.log('Map: Initial setup - Setting button disabled state:', isDisabled);
      onPinButtonDisabled(isDisabled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空の依存関係で初期化時のみ実行

  // ピン投稿ボタンの状態を管理
  useEffect(() => {
    console.log('Map: useEffect for onPinButtonClick, onPinButtonClick:', !!onPinButtonClick);
    console.log('Map: handlePinButtonClick function:', !!handlePinButtonClick);
    if (onPinButtonClick) {
      console.log('Map: Setting handlePinButtonClick callback');
      onPinButtonClick(handlePinButtonClick);
    }
  }, [onPinButtonClick, handlePinButtonClick]);

  // ピン投稿ボタンの無効化状態を管理
  useEffect(() => {
    console.log('Map: useEffect for onPinButtonDisabled, onPinButtonDisabled:', !!onPinButtonDisabled);
    if (onPinButtonDisabled) {
      const isDisabled = isLoading || !userPosition || !boundaries || isUsingSampleData;
      console.log('Map: Setting button disabled state:', isDisabled);
      console.log('Map: isLoading:', isLoading, 'userPosition:', !!userPosition, 'boundaries:', !!boundaries, 'isUsingSampleData:', isUsingSampleData);
      onPinButtonDisabled(isDisabled);
    }
  }, [onPinButtonDisabled, isLoading, userPosition, boundaries, isUsingSampleData]);

  // 都道府県コードを取得する関数
  const getPrefectureFromPosition = (position: [number, number]): string | null => {
    // 簡易的な実装 - 実際はより詳細な判定が必要
    const [lat, lng] = position;

    // 主要な都道府県の座標範囲を定義
    const prefectureRanges = [
      { code: 'JP-13', name: '東京都', latRange: [35.4, 35.9], lngRange: [139.4, 140.0] },
      { code: 'JP-14', name: '神奈川県', latRange: [35.2, 35.6], lngRange: [139.0, 139.8] },
      { code: 'JP-12', name: '千葉県', latRange: [35.0, 35.8], lngRange: [139.8, 140.8] },
      { code: 'JP-08', name: '茨城県', latRange: [35.8, 36.8], lngRange: [139.8, 140.8] },
      // 他の都道府県も同様に定義
    ];

    for (const pref of prefectureRanges) {
      if (lat >= pref.latRange[0] && lat <= pref.latRange[1] &&
        lng >= pref.lngRange[0] && lng <= pref.lngRange[1]) {
        return pref.code;
      }
    }

    return 'JP-13'; // デフォルト
  };

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

        const { error: insertError } = await supabase
          .from('collected_areas')
          .insert({
            user_id: user.id,
            area_name: currentMunicipality
          });

        if (insertError) {
          console.error('コレクション保存エラー:', insertError);
          return;
        }

        setCollectedAreas(prev => new Set([...prev, currentMunicipality!]));
        setMessage(`🎉 【${currentMunicipality}】をコレクションしました！`);
      } catch (error) {
        console.error('コレクション処理エラー:', error);
      }
    }
  }, [userPosition, boundaries, coastline, collectedAreas, setCollectedAreas, isUsingSampleData, supabase, setMessage]);

  // 自動コレクションの開始/停止
  useEffect(() => {
    if (userPosition && boundaries && coastline && !isUsingSampleData && !isLoading) {
      setIsAutoCollecting(true);
      setMessage('位置情報を確認中...');

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

  // 外部からの地方選択
  useEffect(() => {
    if (externalSelectedRegion !== undefined) {
      setSelectedRegion(externalSelectedRegion);
    }
  }, [externalSelectedRegion]);

  // 外部からの地図中心設定
  useEffect(() => {
    if (externalMapCenter) {
      setMapCenter(externalMapCenter);
    }
  }, [externalMapCenter]);

  // 地図表示の制御
  useEffect(() => {
    const effectivePosition = getEffectivePosition();
    if (effectivePosition || mapCenter) {
      setShowMap(true);
    }
  }, [getEffectivePosition, mapCenter]);

  // メッセージの初期化
  useEffect(() => {
    if (isLoading) {
      setMessage('データを読み込み中...');
    } else if (dataError) {
      setMessage(`エラー: ${dataError}`);
    } else {
      const effectivePosition = getEffectivePosition();
      if (effectivePosition) {
        if (isTestUser) {
          setMessage('テストユーザー: 築地の位置情報を使用しています。');
        } else {
          setMessage('現在地を取得しました。');
        }
      }
    }
  }, [isLoading, dataError, getEffectivePosition, isTestUser]);

  // 表示位置の計算
  const positionToDisplay = useMemo(() => {
    if (mapCenter) return mapCenter;
    const effectivePosition = getEffectivePosition();
    if (effectivePosition) return effectivePosition;
    return MAP_CONFIG.DEFAULT_CENTER;
  }, [mapCenter, getEffectivePosition]);

  // 境界線のスタイル設定
  const onEachFeature = useCallback((feature: Feature, layer: Layer) => {
    const areaName = feature.properties?.name;
    if (areaName && collectedAreas.has(areaName)) {
      (layer as Path).setStyle(boundaryStyles.collected);
    }
  }, [collectedAreas]);

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
          setMessage('ログインが必要です。');
          return;
        }

        const { error: insertError } = await supabase
          .from('collected_areas')
          .insert({
            user_id: user.id,
            area_name: currentMunicipality
          });

        if (insertError) {
          console.error('コレクション保存エラー:', insertError);
          setMessage('コレクションの保存に失敗しました。');
          return;
        }

        setCollectedAreas(prev => new Set([...prev, currentMunicipality!]));
        setMessage(`🎉 【${currentMunicipality}】をコレクションしました！`);
      } catch (error) {
        console.error('コレクション処理エラー:', error);
        setMessage('コレクション処理中にエラーが発生しました。');
      }
    } else {
      setMessage(`海岸線まで${minDistance.toFixed(2)}km離れています。1km以内に移動してください。`);
    }
  }, [userPosition, boundaries, coastline, collectedAreas, setCollectedAreas, isUsingSampleData, supabase, setMessage]);

  // エラー表示
  if (dataError) {
    return <ErrorDisplay error={dataError} />;
  }

  // ローディング表示
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner title="地図データを読み込み中..." />
      </div>
    );
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
            zoom={getEffectivePosition() ? 9 : MAP_CONFIG.DEFAULT_ZOOM}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            zoomControl={false}
            // エラーハンドリング
            whenReady={() => {
              console.log('地図の準備が完了しました');
              // 地図の準備が完了したことを確認
              setTimeout(() => {
                try {
                  // 地図のサイズを再計算
                  const mapElement = document.querySelector('.leaflet-container');
                  if (mapElement) {
                    console.log('地図コンテナが見つかりました');
                  }
                } catch (error) {
                  console.warn('地図の初期化エラー:', error);
                }
              }, 100);
            }}
          >
            <ChangeView
              center={positionToDisplay}
              zoom={getEffectivePosition() ? 9 : MAP_CONFIG.DEFAULT_ZOOM}
            />
            <MapControls
              selectedRegion={selectedRegion}
              onRegionChange={handleRegionChange}
              onRegionCenterChange={handleRegionCenterChange}
            />
            <TileLayer
              attribution={TILE_LAYER.attribution}
              url={TILE_LAYER.url}
            />
            {getEffectivePosition() && (
              <Marker
                position={getEffectivePosition()!}
                icon={defaultIcon}
              >
                <Popup>
                  {isTestUser ? 'テストユーザーの現在地（築地）' : 'あなたの現在地'}
                </Popup>
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
            {/* ピンマーカーの表示 */}
            <PinMarkers prefecture={selectedRegion || undefined} />
          </MapContainer>

          {/* ピン投稿フォーム */}
          {(showPinForm || isClosingPinForm) && currentLocationData && (
            <div
              className={`fixed inset-0 bg-bice-blue/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ${isClosingPinForm ? 'animate-out fade-out' : 'animate-in fade-in'
                }`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="pin-form-title"
              aria-describedby="pin-form-description"
            >
              <div
                className={`bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 ${isClosingPinForm
                  ? 'animate-out slide-out-to-bottom-4 fade-out'
                  : 'animate-in slide-in-from-bottom-4 fade-in'
                  }`}
                tabIndex={-1}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    closePinForm();
                  }
                }}
              >
                <div id="pin-form-description" className="sr-only">
                  海岸線の近くでピンを投稿するフォームです
                </div>
                <PinForm
                  locationData={currentLocationData}
                  onSuccess={() => {
                    closePinForm();
                    setMessage('ピンを投稿しました！');
                  }}
                  onCancel={() => {
                    closePinForm();
                  }}
                />
              </div>
            </div>
          )}

          {/* メッセージ表示（上中央） */}
          <StatusMessage
            message={message}
            type={
              message.includes('🎉') ? 'success' :
                message.includes('エラー') || message.includes('失敗') ? 'error' :
                  message.includes('サンプルデータ') ? 'warning' :
                    'default'
            }
          />

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
        </div>
      )}
    </div>
  )
}

