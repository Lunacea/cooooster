import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/shared/libs/supabase'

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    if (!supabase) {
      console.error('API: Supabaseが設定されていません');
      return NextResponse.json(
        { error: 'サーバー設定エラーが発生しました' },
        { status: 500 }
      );
    }
    
    // Authorization headerからトークンを取得
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // トークンを検証
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return NextResponse.json({ error: '無効なトークンです' }, { status: 401 })
    }

    return NextResponse.json({ 
      user: { 
        id: user.id, 
        email: user.email 
      },
      authenticated: true 
    })
  } catch (error) {
    console.error('認証チェックエラー:', error)
    return NextResponse.json({ error: '認証エラー' }, { status: 500 })
  }
} 