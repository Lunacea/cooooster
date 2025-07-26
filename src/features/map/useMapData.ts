import { useState, useEffect } from 'react';
import type { Feature, FeatureCollection, MultiLineString } from 'geojson';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getPrefectureFromPosition, getPrefectureName, getRegionFromPrefecture } from '@/shared/libs/prefectureUtils';
import type { Position } from '@/types/map.types';

interface UserCollection {
  area_name: string;
}

// GeoJSONデータの検証関数
function isValidGeoJSON(data: unknown): data is FeatureCollection {
  return data !== null && 
         typeof data === 'object' && 
         data !== undefined &&
         'type' in data && 
         data.type === 'FeatureCollection' && 
         'features' in data &&
         Array.isArray((data as FeatureCollection).features);
}

function isValidFeature(data: unknown): data is Feature<MultiLineString> {
  return data !== null && 
         typeof data === 'object' && 
         data !== undefined &&
         'type' in data && 
         data.type === 'Feature' && 
         'geometry' in data &&
         (data as Feature<MultiLineString>).geometry !== undefined;
}

// サンプルデータ生成関数
function createSampleData() {
  const sampleBoundaries: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'サンプルエリア1' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [139.5, 35.5],
            [139.6, 35.5],
            [139.6, 35.6],
            [139.5, 35.6],
            [139.5, 35.5]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'サンプルエリア2' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [139.6, 35.5],
            [139.7, 35.5],
            [139.7, 35.6],
            [139.6, 35.6],
            [139.6, 35.5]
          ]]
        }
      }
    ]
  };

  const sampleCoastline: Feature<MultiLineString> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiLineString',
      coordinates: [
        [
          [139.5, 35.5],
          [139.6, 35.5],
          [139.7, 35.5]
        ],
        [
          [139.5, 35.6],
          [139.6, 35.6],
          [139.7, 35.6]
        ]
      ]
    }
  };

  return { sampleBoundaries, sampleCoastline };
}

export function useMapData(userPosition: Position | null, selectedRegion?: string | null, isPositionResolved?: boolean) {
  const [boundaries, setBoundaries] = useState<FeatureCollection | null>(null);
  const [coastline, setCoastline] = useState<Feature<MultiLineString> | null>(null);
  const [collectedAreas, setCollectedAreas] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingSampleData, setIsUsingSampleData] = useState(false);
  const [currentPrefecture, setCurrentPrefecture] = useState<string | null>(null);
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);
  const [displayedPrefectures, setDisplayedPrefectures] = useState<string[]>([]);

  useEffect(() => {
    // クライアントサイドでのみ実行
    // setIsClient(true); // Removed as per edit hint
  }, []);

  useEffect(() => {
    // 位置情報の解決を待つ
    if (!isPositionResolved) {
      console.log('位置情報の解決を待機中...');
      return;
    }

    console.log('位置情報解決完了、都道府県判定開始');

    // ユーザーの位置情報に基づいて都道府県を決定
    if (userPosition && !currentPrefecture) {
      const prefectureCode = getPrefectureFromPosition(userPosition);
      const prefectureName = getPrefectureName(prefectureCode);
      console.log(`現在地から都道府県を判定: ${prefectureName} (${prefectureCode})`);
      
      setCurrentPrefecture(prefectureCode);
      
      // すべての都道府県で地域を自動選択
      const region = getRegionFromPrefecture(prefectureCode);
      if (region) {
        setCurrentRegion(region.name);
        console.log(`地域「${region.name}」を自動選択`);
      } else {
        console.warn(`都道府県 ${prefectureCode} の地域が見つかりません`);
        setCurrentRegion(null);
      }
    } else if (currentPrefecture) {
      // 手動選択された都道府県を使用
      console.log(`手動選択された都道府県: ${getPrefectureName(currentPrefecture)} (${currentPrefecture})`);
      
      // 手動選択された地域がある場合はそれを使用、なければ自動選択
      if (selectedRegion) {
        setCurrentRegion(selectedRegion);
        console.log(`手動選択された地域: ${selectedRegion}`);
      } else {
        const region = getRegionFromPrefecture(currentPrefecture);
        if (region) {
          setCurrentRegion(region.name);
          console.log(`地域「${region.name}」を自動選択`);
        } else {
          setCurrentRegion(null);
        }
      }
    } else if (!userPosition && !currentPrefecture) {
      // 位置情報が取得できない場合のみ関東をデフォルトとする
      setCurrentPrefecture('JP-13');
      setCurrentRegion('関東');
      console.log('位置情報が取得できないため、関東をデフォルトとして設定');
    }
  }, [userPosition, currentPrefecture, selectedRegion, isPositionResolved]);

  useEffect(() => {
    // クライアントサイドでのみデータを取得
    // if (!isClient || !currentPrefecture) return; // Removed as per edit hint
    if (!currentPrefecture) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let apiUrl = `/api/map-data?prefecture=${currentPrefecture}`;
        
        // 地域指定がある場合は地域パラメータを追加
        if (currentRegion) {
          apiUrl += `&region=${encodeURIComponent(currentRegion)}`;
        }
        
        console.log(`データ取得開始: ${currentPrefecture} (${getPrefectureName(currentPrefecture)})${currentRegion ? ` - 地域: ${currentRegion}` : ''}`);
        
        // API Routeを使用してデータを取得
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'データの取得に失敗しました');
        }

        const data = await response.json();
        
        console.log('API Routeからデータ取得完了:', {
          prefecture: getPrefectureName(currentPrefecture),
          region: currentRegion,
          boundariesType: data.boundaries?.type,
          boundariesFeatures: data.boundaries?.features?.length,
          coastlineType: data.coastline?.type,
          coastlineGeometry: data.coastline?.geometry?.type,
          displayedPrefectures: data.prefectures
        });

        // GeoJSONデータの検証
        if (!isValidGeoJSON(data.boundaries)) {
          console.error('無効な境界線データ:', data.boundaries);
          throw new Error('境界線データが無効なGeoJSON形式です。');
        }

        if (!isValidFeature(data.coastline)) {
          console.error('無効な海岸線データ:', data.coastline);
          throw new Error('海岸線データが無効なGeoJSON形式です。');
        }

        setBoundaries(data.boundaries);
        setCoastline(data.coastline);
        setDisplayedPrefectures(data.prefectures || [currentPrefecture]);
        setIsUsingSampleData(false);

        // ユーザーのコレクションデータ取得（Supabaseクライアントを使用）
        const supabase = createClientComponentClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userCollections, error } = await supabase.from('collected_areas').select('area_name').eq('user_id', user.id);
          if (error) throw error;
          setCollectedAreas(new Set((userCollections ?? []).map((item: UserCollection) => item.area_name)));
        }

        setError(null);
        console.log('データ読み込み完了');
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'データの読み込みに失敗しました。';
        console.error('データ読み込みエラー:', errorMessage);
        
        // エラーの場合はサンプルデータを使用
        console.warn('エラーのため、サンプルデータを使用します。');
        const { sampleBoundaries, sampleCoastline } = createSampleData();
        setBoundaries(sampleBoundaries);
        setCoastline(sampleCoastline);
        setDisplayedPrefectures([currentPrefecture]);
        setIsUsingSampleData(true);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPrefecture, currentRegion]);

  return { 
    boundaries, 
    coastline, 
    collectedAreas, 
    isLoading, 
    error, 
    setCollectedAreas, 
    isUsingSampleData,
    currentPrefecture: currentPrefecture ? getPrefectureName(currentPrefecture) : null,
    currentRegion,
    displayedPrefectures
  };
} 