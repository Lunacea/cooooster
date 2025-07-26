import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getRegionFromPrefecture, getRegionByName } from '@/shared/libs/prefectureUtils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const STORAGE_BUCKET = 'map-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prefectureIso = searchParams.get('prefecture') || 'JP-13';
    const regionName = searchParams.get('region');
    
    console.log(`API: データ取得開始: ${prefectureIso}${regionName ? ` (地域: ${regionName})` : ''}`);
    
    // 地域指定がある場合は地域の都道府県リストを使用
    let targetPrefectures: string[] = [prefectureIso];
    
    console.log(`API: 初期都道府県: ${prefectureIso}`);
    console.log(`API: 地域指定: ${regionName || 'なし'}`);
    
    if (regionName) {
      const region = getRegionByName(regionName);
      if (region) {
        targetPrefectures = region.prefectures;
        console.log(`API: 地域「${regionName}」の都道府県:`, targetPrefectures);
      }
    } else {
      // すべての都道府県で地域を自動選択
      const region = getRegionFromPrefecture(prefectureIso);
      if (region) {
        targetPrefectures = region.prefectures;
        console.log(`API: 都道府県「${prefectureIso}」の地域「${region.name}」を自動選択:`, targetPrefectures);
      } else {
        console.warn(`API: 都道府県 ${prefectureIso} の地域が見つかりません`);
      }
    }
    
    const allBoundaries: Array<{ type: string; properties: unknown; geometry: unknown }> = [];
    const allCoastlines: Array<{ type: string; properties: unknown; geometry: unknown }> = [];
    let hasValidData = false;
    
    // 各都道府県のデータを取得
    for (const prefectureCode of targetPrefectures) {
      try {
        console.log(`API: ${prefectureCode} のデータを取得中...`);
        
        // ファイルの存在を確認
        const { data: fileList, error: fileError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .list(prefectureCode);
        
        if (fileError) {
          console.error(`API: ${prefectureCode} のファイル一覧取得エラー:`, fileError);
          continue;
        }

        const boundariesFile = fileList?.find(file => file.name === 'boundaries_processed.geojson');
        const coastlineFile = fileList?.find(file => file.name === 'coastline_processed.geojson');

        if (!boundariesFile || !coastlineFile) {
          console.warn(`API: ${prefectureCode} の必要なファイルが見つかりません`);
          continue;
        }

        // ファイルのURLを取得
        const { data: boundariesUrlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(`${prefectureCode}/boundaries_processed.geojson`);
        
        const { data: coastlineUrlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(`${prefectureCode}/coastline_processed.geojson`);

        if (!boundariesUrlData?.publicUrl || !coastlineUrlData?.publicUrl) {
          console.warn(`API: ${prefectureCode} のファイルURLを取得できませんでした`);
          continue;
        }

        // ファイルを取得
        const [boundariesRes, coastlineRes] = await Promise.all([
          fetch(boundariesUrlData.publicUrl),
          fetch(coastlineUrlData.publicUrl)
        ]);

        if (!boundariesRes.ok || !coastlineRes.ok) {
          console.warn(`API: ${prefectureCode} のファイル取得に失敗しました`);
          continue;
        }

        const boundariesData = await boundariesRes.json();
        const coastlineData = await coastlineRes.json();
        
        // データを統合
        if (boundariesData.features) {
          allBoundaries.push(...boundariesData.features);
        }
        if (coastlineData.geometry) {
          allCoastlines.push(coastlineData);
        }
        
        hasValidData = true;
        console.log(`API: ${prefectureCode} のデータ取得成功`);
        
      } catch (error) {
        console.error(`API: ${prefectureCode} のデータ取得エラー:`, error);
        continue;
      }
    }
    
    if (!hasValidData) {
      console.warn('API: 有効なデータが見つかりませんでした');
      return NextResponse.json(
        { error: '有効な地図データが見つかりませんでした' },
        { status: 404 }
      );
    }

    // 統合されたデータを作成
    const combinedBoundaries = {
      type: 'FeatureCollection',
      features: allBoundaries
    };

    const combinedCoastline = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiLineString',
        coordinates: allCoastlines.flatMap(coastline => (coastline.geometry as { coordinates: number[][][] }).coordinates)
      }
    };

    console.log('API: データ取得完了', {
      boundariesCount: allBoundaries.length,
      coastlineCount: allCoastlines.length,
      prefectures: targetPrefectures
    });

    return NextResponse.json({
      boundaries: combinedBoundaries,
      coastline: combinedCoastline,
      prefectures: targetPrefectures
    });

  } catch (error) {
    console.error('API: エラーが発生しました:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 