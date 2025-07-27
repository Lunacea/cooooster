import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// .env.localファイルを読み込み
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addMoreTestData() {
  try {
    console.log('追加テストデータを検索中...')
    
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
      console.log('')
      console.log('以下のSQLをSupabaseダッシュボードで実行してください:')
      console.log('')
      console.log(`-- 追加テスト用コレクションデータ`)
      console.log(`INSERT INTO public.collected_areas (user_id, area_name, created_at, updated_at) VALUES`)
      
      // 静岡県の海岸線エリア
      console.log(`-- 静岡県の海岸線エリア`)
      console.log(`('${testUser.id}', '静岡市', now(), now()),`)
      console.log(`('${testUser.id}', '浜松市', now(), now()),`)
      console.log(`('${testUser.id}', '沼津市', now(), now()),`)
      console.log(`('${testUser.id}', '熱海市', now(), now()),`)
      console.log(`('${testUser.id}', '伊東市', now(), now()),`)
      console.log(`('${testUser.id}', '下田市', now(), now()),`)
      console.log(`('${testUser.id}', '富士市', now(), now()),`)
      console.log(`('${testUser.id}', '富士宮市', now(), now()),`)
      console.log(`('${testUser.id}', '御前崎市', now(), now()),`)
      console.log(`('${testUser.id}', '菊川市', now(), now()),`)
      
      // 愛知県の海岸線エリア
      console.log(`-- 愛知県の海岸線エリア`)
      console.log(`('${testUser.id}', '名古屋市', now(), now()),`)
      console.log(`('${testUser.id}', '豊橋市', now(), now()),`)
      console.log(`('${testUser.id}', '岡崎市', now(), now()),`)
      console.log(`('${testUser.id}', '一宮市', now(), now()),`)
      console.log(`('${testUser.id}', '春日井市', now(), now()),`)
      console.log(`('${testUser.id}', '津島市', now(), now()),`)
      console.log(`('${testUser.id}', '碧南市', now(), now()),`)
      console.log(`('${testUser.id}', '刈谷市', now(), now()),`)
      console.log(`('${testUser.id}', '豊田市', now(), now()),`)
      console.log(`('${testUser.id}', '安城市', now(), now()),`)
      
      // 三重県の海岸線エリア
      console.log(`-- 三重県の海岸線エリア`)
      console.log(`('${testUser.id}', '津市', now(), now()),`)
      console.log(`('${testUser.id}', '四日市市', now(), now()),`)
      console.log(`('${testUser.id}', '松阪市', now(), now()),`)
      console.log(`('${testUser.id}', '桑名市', now(), now()),`)
      console.log(`('${testUser.id}', '鈴鹿市', now(), now()),`)
      console.log(`('${testUser.id}', '名張市', now(), now()),`)
      console.log(`('${testUser.id}', '尾鷲市', now(), now()),`)
      console.log(`('${testUser.id}', '熊野市', now(), now()),`)
      console.log(`('${testUser.id}', '伊勢市', now(), now()),`)
      console.log(`('${testUser.id}', '鳥羽市', now(), now()),`)
      
      // 和歌山県の海岸線エリア
      console.log(`-- 和歌山県の海岸線エリア`)
      console.log(`('${testUser.id}', '和歌山市', now(), now()),`)
      console.log(`('${testUser.id}', '海南市', now(), now()),`)
      console.log(`('${testUser.id}', '御坊市', now(), now()),`)
      console.log(`('${testUser.id}', '田辺市', now(), now()),`)
      console.log(`('${testUser.id}', '新宮市', now(), now()),`)
      console.log(`('${testUser.id}', '紀の川市', now(), now()),`)
      console.log(`('${testUser.id}', '岩出市', now(), now()),`)
      console.log(`('${testUser.id}', '橋本市', now(), now()),`)
      console.log(`('${testUser.id}', '有田市', now(), now()),`)
      console.log(`('${testUser.id}', '串本町', now(), now()),`)
      
      // 大阪府の海岸線エリア
      console.log(`-- 大阪府の海岸線エリア`)
      console.log(`('${testUser.id}', '大阪市', now(), now()),`)
      console.log(`('${testUser.id}', '堺市', now(), now()),`)
      console.log(`('${testUser.id}', '岸和田市', now(), now()),`)
      console.log(`('${testUser.id}', '泉大津市', now(), now()),`)
      console.log(`('${testUser.id}', '泉佐野市', now(), now()),`)
      console.log(`('${testUser.id}', '高石市', now(), now()),`)
      console.log(`('${testUser.id}', '泉南市', now(), now()),`)
      console.log(`('${testUser.id}', '阪南市', now(), now()),`)
      console.log(`('${testUser.id}', '貝塚市', now(), now()),`)
      console.log(`('${testUser.id}', '泉北郡忠岡町', now(), now()),`)
      
      // 兵庫県の海岸線エリア
      console.log(`-- 兵庫県の海岸線エリア`)
      console.log(`('${testUser.id}', '神戸市', now(), now()),`)
      console.log(`('${testUser.id}', '姫路市', now(), now()),`)
      console.log(`('${testUser.id}', '尼崎市', now(), now()),`)
      console.log(`('${testUser.id}', '明石市', now(), now()),`)
      console.log(`('${testUser.id}', '西宮市', now(), now()),`)
      console.log(`('${testUser.id}', '芦屋市', now(), now()),`)
      console.log(`('${testUser.id}', '伊丹市', now(), now()),`)
      console.log(`('${testUser.id}', '宝塚市', now(), now()),`)
      console.log(`('${testUser.id}', '川西市', now(), now()),`)
      console.log(`('${testUser.id}', '三田市', now(), now()),`)
      
      // 岡山県の海岸線エリア
      console.log(`-- 岡山県の海岸線エリア`)
      console.log(`('${testUser.id}', '岡山市', now(), now()),`)
      console.log(`('${testUser.id}', '倉敷市', now(), now()),`)
      console.log(`('${testUser.id}', '津山市', now(), now()),`)
      console.log(`('${testUser.id}', '玉野市', now(), now()),`)
      console.log(`('${testUser.id}', '笠岡市', now(), now()),`)
      console.log(`('${testUser.id}', '井原市', now(), now()),`)
      console.log(`('${testUser.id}', '総社市', now(), now()),`)
      console.log(`('${testUser.id}', '高梁市', now(), now()),`)
      console.log(`('${testUser.id}', '新見市', now(), now()),`)
      console.log(`('${testUser.id}', '備前市', now(), now()),`)
      
      // 広島県の海岸線エリア
      console.log(`-- 広島県の海岸線エリア`)
      console.log(`('${testUser.id}', '広島市', now(), now()),`)
      console.log(`('${testUser.id}', '呉市', now(), now()),`)
      console.log(`('${testUser.id}', '竹原市', now(), now()),`)
      console.log(`('${testUser.id}', '三原市', now(), now()),`)
      console.log(`('${testUser.id}', '尾道市', now(), now()),`)
      console.log(`('${testUser.id}', '福山市', now(), now()),`)
      console.log(`('${testUser.id}', '府中市', now(), now()),`)
      console.log(`('${testUser.id}', '三次市', now(), now()),`)
      console.log(`('${testUser.id}', '庄原市', now(), now()),`)
      console.log(`('${testUser.id}', '大竹市', now(), now()),`)
      
      // 山口県の海岸線エリア
      console.log(`-- 山口県の海岸線エリア`)
      console.log(`('${testUser.id}', '下関市', now(), now()),`)
      console.log(`('${testUser.id}', '宇部市', now(), now()),`)
      console.log(`('${testUser.id}', '山口市', now(), now()),`)
      console.log(`('${testUser.id}', '萩市', now(), now()),`)
      console.log(`('${testUser.id}', '防府市', now(), now()),`)
      console.log(`('${testUser.id}', '下松市', now(), now()),`)
      console.log(`('${testUser.id}', '岩国市', now(), now()),`)
      console.log(`('${testUser.id}', '光市', now(), now()),`)
      console.log(`('${testUser.id}', '長門市', now(), now()),`)
      console.log(`('${testUser.id}', '柳井市', now(), now());`)
      
      console.log('')
      console.log('これで合計80の海岸線エリアがコレクションされます！')
      console.log('')
      console.log('ログイン情報:')
      console.log('メールアドレス: test@cooooster.com')
      console.log('パスワード: password123')
    } else {
      console.log('❌ テストユーザーが見つかりませんでした')
    }

  } catch (error) {
    console.error('エラーが発生しました:', error)
  }
}

addMoreTestData() 