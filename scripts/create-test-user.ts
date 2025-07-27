import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// .env.localファイルを読み込み
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestUser() {
  try {
    console.log('テストユーザーを作成中...')
    
    // テストユーザーを作成
    const { data: user, error } = await supabase.auth.admin.createUser({
      email: 'test@cooooster.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        name: 'テストユーザー',
        role: 'test'
      }
    })

    if (error) {
      console.error('ユーザー作成エラー:', error)
      return
    }

    console.log('✅ テストユーザーが作成されました！')
    console.log('ユーザーID:', user.user.id)
    console.log('メールアドレス:', user.user.email)
    console.log('')
    console.log('以下のSQLをSupabaseダッシュボードで実行してください:')
    console.log('')
    console.log(`-- テスト用コレクションデータを追加`)
    console.log(`INSERT INTO public.collected_areas (user_id, area_name, created_at, updated_at) VALUES`)
    console.log(`-- 神奈川県の海岸線エリア`)
    console.log(`('${user.user.id}', '横浜市', now(), now()),`)
    console.log(`('${user.user.id}', '鎌倉市', now(), now()),`)
    console.log(`('${user.user.id}', '逗子市', now(), now()),`)
    console.log(`('${user.user.id}', '藤沢市', now(), now()),`)
    console.log(`('${user.user.id}', '茅ヶ崎市', now(), now()),`)
    console.log(`('${user.user.id}', '平塚市', now(), now()),`)
    console.log(`('${user.user.id}', '小田原市', now(), now()),`)
    console.log(`('${user.user.id}', '三浦市', now(), now()),`)
    console.log(`('${user.user.id}', '葉山町', now(), now()),`)
    console.log(`('${user.user.id}', '真鶴町', now(), now()),`)
    console.log(`-- 千葉県の海岸線エリア`)
    console.log(`('${user.user.id}', '千葉市', now(), now()),`)
    console.log(`('${user.user.id}', '船橋市', now(), now()),`)
    console.log(`('${user.user.id}', '市川市', now(), now()),`)
    console.log(`('${user.user.id}', '浦安市', now(), now()),`)
    console.log(`('${user.user.id}', '習志野市', now(), now()),`)
    console.log(`('${user.user.id}', '八千代市', now(), now()),`)
    console.log(`('${user.user.id}', '佐倉市', now(), now()),`)
    console.log(`('${user.user.id}', '成田市', now(), now()),`)
    console.log(`('${user.user.id}', '銚子市', now(), now()),`)
    console.log(`('${user.user.id}', '館山市', now(), now());`)
    console.log('')
    console.log('ログイン情報:')
    console.log('メールアドレス: test@cooooster.com')
    console.log('パスワード: password123')

  } catch (error) {
    console.error('エラーが発生しました:', error)
  }
}

createTestUser() 