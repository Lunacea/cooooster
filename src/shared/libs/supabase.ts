import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// クライアントサイド用のSupabaseクライアント
export const createSupabaseClient = () => {
  return createClientComponentClient()
}

// サーバーサイド用のSupabaseクライアント
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase環境変数が設定されていません')
    return null
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
} 