import { useState, useEffect, useRef } from 'react';
import type { Feature, FeatureCollection, MultiLineString } from 'geojson';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getPrefectureFromPosition, getPrefectureName, getRegionFromPrefecture, getRegionByName } from '@/shared/libs/prefectureUtils';
import type { Position } from '@/types/map.types';

interface UserCollection {
  area_name: string;
}

interface CacheEntry {
  data: {
    boundaries: FeatureCollection;
    coastline: Feature<MultiLineString>;
    prefectures: string[];
  };
  timestamp: number;
  expiresAt: number;
}

// メモリキャッシュ
const memoryCache = new Map<string, CacheEntry>();

// キャッシュの有効期限（5分）
const CACHE_DURATION = 5 * 60 * 1000;

// キャッシュキーを生成
function generateCacheKey(prefecture: string, region?: string | null): string {
  const regionPart = region ?? 'auto';
  return `${prefecture}_${regionPart}`;
}

// キャッシュからデータを取得
function getFromCache(key: string): CacheEntry | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  
  return entry;
}

// キャッシュにデータを保存
function setCache(key: string, data: CacheEntry['data']): void {
  const now = Date.now();
  memoryCache.set(key, {
    data,
    timestamp: now,
    expiresAt: now + CACHE_DURATION
  });
  
  // キャッシュサイズを制限（最大50エントリ）
  if (memoryCache.size > 50) {
    const oldestKey = memoryCache.keys().next().value;
    if (oldestKey) {
      memoryCache.delete(oldestKey);
    }
  }
}

// セッションストレージからデータを取得
function getFromSessionStorage(key: string): CacheEntry | null {
  try {
    const stored = sessionStorage.getItem(`map_cache_${key}`);
    if (!stored) return null;
    
    const entry: CacheEntry = JSON.parse(stored);
    if (Date.now() > entry.expiresAt) {
      sessionStorage.removeItem(`map_cache_${key}`);
      return null;
    }
    
    return entry;
  } catch {
    return null;
  }
}

// セッションストレージにデータを保存
function setSessionStorage(key: string, data: CacheEntry['data']): void {
  try {
    const now = Date.now();
    const entry: CacheEntry = {
      data,
      timestamp: now,
      expiresAt: now + CACHE_DURATION
    };
    sessionStorage.setItem(`map_cache_${key}`, JSON.stringify(entry));
  } catch {
    // セッションストレージが利用できない場合は無視
  }
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

    // 地方が手動選択された場合は、その地方の最初の都道府県を使用
    if (selectedRegion) {
      const region = getRegionByName(selectedRegion);
      if (region && region.prefectures.length > 0) {
        const firstPrefecture = region.prefectures[0];
        setCurrentPrefecture(firstPrefecture);
        setCurrentRegion(selectedRegion);
        console.log(`手動選択された地域「${selectedRegion}」の都道府県: ${getPrefectureName(firstPrefecture)} (${firstPrefecture})`);
        return;
      }
    }

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
    } else if (currentPrefecture && !selectedRegion) {
      // 手動選択された都道府県を使用
      console.log(`手動選択された都道府県: ${getPrefectureName(currentPrefecture)} (${currentPrefecture})`);
      
      // 自動選択された地域を使用
      const region = getRegionFromPrefecture(currentPrefecture);
      if (region) {
        setCurrentRegion(region.name);
        console.log(`地域「${region.name}」を自動選択`);
      } else {
        setCurrentRegion(null);
      }
    } else if (!userPosition && !currentPrefecture) {
      // 位置情報が取得できない場合のみ関東をデフォルトとする
      setCurrentPrefecture('JP-13');
      setCurrentRegion('関東');
      console.log('位置情報が取得できないため、関東をデフォルトとして設定');
    }
  }, [userPosition, currentPrefecture, selectedRegion, isPositionResolved]);

  useEffect(() => {
    if (!currentPrefecture) return;

    // 地方変更時にデータをリセット
    setBoundaries(null);
    setCoastline(null);
    setError(null);

    const fetchData = async () => {
      setIsLoading(true);
      
      // キャッシュキーを生成
      const cacheKey = generateCacheKey(currentPrefecture, currentRegion);
      
      // メモリキャッシュから取得を試行
      let cachedData = getFromCache(cacheKey);
      if (cachedData) {
        console.log(`キャッシュからデータを取得: ${cacheKey}`);
        setBoundaries(cachedData.data.boundaries);
        setCoastline(cachedData.data.coastline);
        setDisplayedPrefectures(cachedData.data.prefectures);
        setIsUsingSampleData(false);
        setError(null);
        
        // キャッシュからデータを取得した場合でも、ユーザーのコレクションデータを取得
        try {
          const supabase = createClientComponentClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: userCollections, error } = await supabase.from('collected_areas').select('area_name').eq('user_id', user.id);
            if (error) throw error;
            setCollectedAreas(new Set((userCollections ?? []).map((item: UserCollection) => item.area_name)));
          }
        } catch (error) {
          console.error('コレクションデータの取得に失敗:', error);
        }
        
        setIsLoading(false);
        return;
      }
      
      // セッションストレージから取得を試行
      cachedData = getFromSessionStorage(cacheKey);
      if (cachedData) {
        console.log(`セッションストレージからデータを取得: ${cacheKey}`);
        setBoundaries(cachedData.data.boundaries);
        setCoastline(cachedData.data.coastline);
        setDisplayedPrefectures(cachedData.data.prefectures);
        setIsUsingSampleData(false);
        setError(null);
        
        // セッションストレージからデータを取得した場合でも、ユーザーのコレクションデータを取得
        try {
          const supabase = createClientComponentClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: userCollections, error } = await supabase.from('collected_areas').select('area_name').eq('user_id', user.id);
            if (error) throw error;
            setCollectedAreas(new Set((userCollections ?? []).map((item: UserCollection) => item.area_name)));
          }
        } catch (error) {
          console.error('コレクションデータの取得に失敗:', error);
        }
        
        setIsLoading(false);
        
        // メモリキャッシュにも保存
        setCache(cacheKey, cachedData.data);
        return;
      }

      try {
        let apiUrl = `/api/map-data?prefecture=${currentPrefecture}`;
        
        if (currentRegion) {
          apiUrl += `&region=${encodeURIComponent(currentRegion)}`;
        }
        
        console.log(`APIからデータ取得開始: ${currentPrefecture} (${getPrefectureName(currentPrefecture)})${currentRegion ? ` - 地域: ${currentRegion}` : ''}`);
        
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

        // キャッシュに保存
        const cacheData = {
          boundaries: data.boundaries,
          coastline: data.coastline,
          prefectures: data.prefectures || [currentPrefecture]
        };
        
        setCache(cacheKey, cacheData);
        setSessionStorage(cacheKey, cacheData);

        setBoundaries(data.boundaries);
        setCoastline(data.coastline);
        setDisplayedPrefectures(data.prefectures || [currentPrefecture]);
        setIsUsingSampleData(false);

        // ユーザーのコレクションデータ取得
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