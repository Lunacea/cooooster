import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 環境変数が設定されていない場合は早期リターン
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase環境変数が設定されていません。アップロード機能は無効です。');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが提供されていません' },
        { status: 400 }
      );
    }

    // ファイルサイズチェック（5MB制限）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ファイルサイズが5MBを超えています' },
        { status: 400 }
      );
    }

    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '画像ファイルのみアップロード可能です' },
        { status: 400 }
      );
    }

    console.log('画像アップロード開始:', file.name);

    // Supabase Storageが利用できない場合のフォールバック
    if (!supabase) {
      console.log('Supabase設定が不完全です。Base64エンコードを使用します。');
      
      // ファイルをBase64エンコード
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      return NextResponse.json({
        url: dataUrl,
        message: '画像のアップロードが完了しました（Base64形式）'
      });
    }

    // ファイル名を生成
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `pins/${timestamp}.${fileExtension}`;

    // Supabase Storageにアップロード
    const { data, error } = await supabase!.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase Storage エラー:', error);
      
      // バケットが存在しない場合のフォールバック
      if (error.message.includes('bucket') || error.message.includes('not found')) {
        console.log('Supabase Storageバケットが存在しません。Base64エンコードを使用します。');
        
        // ファイルをBase64エンコード
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        
        return NextResponse.json({
          url: dataUrl,
          message: '画像のアップロードが完了しました（Base64形式）'
        });
      }
      
      return NextResponse.json(
        { error: '画像のアップロードに失敗しました' },
        { status: 500 }
      );
    }

    console.log('画像アップロード成功:', data);

    // 公開URLを取得
    const { data: urlData } = supabase!.storage
      .from('images')
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: urlData.publicUrl,
      message: '画像のアップロードが完了しました'
    });

  } catch (error) {
    console.error('画像アップロードエラー:', error);
    
    // エラーが発生した場合もBase64エンコードを試行
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        
        return NextResponse.json({
          url: dataUrl,
          message: '画像のアップロードが完了しました（Base64形式）'
        });
      }
    } catch (fallbackError) {
      console.error('フォールバック処理も失敗:', fallbackError);
    }
    
    return NextResponse.json(
      { error: '画像のアップロードに失敗しました' },
      { status: 500 }
    );
  }
} 