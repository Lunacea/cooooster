import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getRegionFromPrefecture, getRegionByName } from '@/shared/libs/prefectureUtils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 環境変数が設定されていない場合は早期リターン
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase環境変数が設定されていません。map-data APIは無効です。');
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const STORAGE_BUCKET = 'map-data';

export async function GET(request: NextRequest) {
  try {
    // Supabaseが設定されていない場合はエラーを返す
    if (!supabase) {
      console.error('API: Supabaseが設定されていません');
      return NextResponse.json(
        { error: 'サーバー設定エラーが発生しました' },
        { status: 500 }
      );
    }

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

        const boundariesFile = fileList?.find((file: { name: string }) => file.name === 'boundaries_processed.geojson');
        const coastlineFile = fileList?.find((file: { name: string }) => file.name === 'coastline_processed.geojson');

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
        if (coastlineData.geometry && typeof coastlineData.geometry === 'object') {
          allCoastlines.push(coastlineData as { type: string; properties: unknown; geometry: { coordinates: number[][][] } });
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
    const responseData = {
      boundaries: {
        type: 'FeatureCollection',
        features: allBoundaries
      },
      coastline: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiLineString',
          coordinates: allCoastlines.map(coastline => (coastline.geometry as { coordinates: number[][][] }).coordinates).flat()
        }
      },
      prefectures: targetPrefectures
    };
    
    // キャッシュヘッダーを設定（5分間キャッシュ）
    const response = NextResponse.json(responseData);
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    
    // ETagはASCII文字のみ許可のため、ハッシュを使用
    const etagValue = Buffer.from(`${prefectureIso}_${regionName || 'auto'}_${Date.now()}`).toString('base64');
    response.headers.set('ETag', `"${etagValue}"`);
    
    return response;

  } catch (error) {
    console.error('API: エラーが発生しました:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 