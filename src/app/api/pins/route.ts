import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 環境変数が設定されていない場合は早期リターン
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase環境変数が設定されていません。pins APIは無効です。');
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// ピンの投稿
export async function POST(request: NextRequest) {
  try {
    // Supabaseが設定されていない場合はエラーを返す
    if (!supabase) {
      console.error('API: Supabaseが設定されていません');
      return NextResponse.json(
        { error: 'サーバー設定エラーが発生しました' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { title, content, image_url, latitude, longitude, prefecture_code, area_name, distance_to_coastline } = body;

    // ユーザー認証チェック
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 });
    }

    // バリデーション
    if (!title || !content || !latitude || !longitude || !prefecture_code || !area_name) {
      return NextResponse.json({ error: '必要な情報が不足しています' }, { status: 400 });
    }

    // 海岸線までの距離が5km以内かチェック
    if (distance_to_coastline && parseFloat(distance_to_coastline) > 5) {
      return NextResponse.json({ error: '海岸線から5km以内でのみ投稿可能です' }, { status: 400 });
    }

    // ピンをデータベースに保存
    const { data: pin, error: insertError } = await supabase
      .from('pins')
      .insert({
        user_id: user.id,
        title,
        content,
        image_url,
        latitude,
        longitude,
        prefecture_code,
        area_name,
        distance_to_coastline
      })
      .select()
      .single();

    if (insertError) {
      console.error('ピン投稿エラー:', insertError);
      return NextResponse.json({ error: 'ピンの投稿に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'ピンを投稿しました',
      pin 
    });

  } catch (error) {
    console.error('ピン投稿APIエラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

// ピンの取得
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
    const prefecture = searchParams.get('prefecture');
    const area = searchParams.get('area');

    let query = supabase
      .from('pins')
      .select('*')
      .order('created_at', { ascending: false });

    if (prefecture) {
      query = query.eq('prefecture_code', prefecture);
    }

    if (area) {
      query = query.eq('area_name', area);
    }

    const { data: pins, error } = await query;

    if (error) {
      console.error('ピン取得エラー:', error);
      return NextResponse.json({ error: 'ピンの取得に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ pins });

  } catch (error) {
    console.error('ピン取得APIエラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
} 