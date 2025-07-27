import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// .env.localファイルを読み込み
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getTestUser() {
  try {
    console.log('テストユーザーを検索中...')
    
    // テストユーザーを検索
    const { data: users, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('ユーザー検索エラー:', error)
      return
    }

    const testUser = users.users.find(user => user.email === 'test@cooooster.com')

    if (testUser) {
      console.log('✅ テストユーザーが見つかりました！')
      console.log('ユーザーID:', testUser.id)
      console.log('メールアドレス:', testUser.email)
      console.log('')
      console.log('以下のSQLをSupabaseダッシュボードで実行してください:')
      console.log('')
      console.log(`-- テスト用コレクションデータを追加`)
      console.log(`INSERT INTO public.collected_areas (user_id, area_name, created_at, updated_at) VALUES`)
      console.log(`-- 神奈川県の海岸線エリア`)
      console.log(`('${testUser.id}', '横浜市', now(), now()),`)
      console.log(`('${testUser.id}', '鎌倉市', now(), now()),`)
      console.log(`('${testUser.id}', '逗子市', now(), now()),`)
      console.log(`('${testUser.id}', '藤沢市', now(), now()),`)
      console.log(`('${testUser.id}', '茅ヶ崎市', now(), now()),`)
      console.log(`('${testUser.id}', '平塚市', now(), now()),`)
      console.log(`('${testUser.id}', '小田原市', now(), now()),`)
      console.log(`('${testUser.id}', '三浦市', now(), now()),`)
      console.log(`('${testUser.id}', '葉山町', now(), now()),`)
      console.log(`('${testUser.id}', '真鶴町', now(), now()),`)
      console.log(`-- 千葉県の海岸線エリア`)
      console.log(`('${testUser.id}', '千葉市', now(), now()),`)
      console.log(`('${testUser.id}', '船橋市', now(), now()),`)
      console.log(`('${testUser.id}', '市川市', now(), now()),`)
      console.log(`('${testUser.id}', '浦安市', now(), now()),`)
      console.log(`('${testUser.id}', '習志野市', now(), now()),`)
      console.log(`('${testUser.id}', '八千代市', now(), now()),`)
      console.log(`('${testUser.id}', '佐倉市', now(), now()),`)
      console.log(`('${testUser.id}', '成田市', now(), now()),`)
      console.log(`('${testUser.id}', '銚子市', now(), now()),`)
      console.log(`('${testUser.id}', '館山市', now(), now());`)
      console.log('')
      console.log('ログイン情報:')
      console.log('メールアドレス: test@cooooster.com')
      console.log('パスワード: password123')
    } else {
      console.log('❌ テストユーザーが見つかりませんでした')
      console.log('利用可能なユーザー:')
      users.users.forEach(user => {
        console.log(`- ${user.email} (${user.id})`)
      })
    }

  } catch (error) {
    console.error('エラーが発生しました:', error)
  }
}

getTestUser() 