-- テスト用データセットアップ
-- SupabaseダッシュボードのSQLエディタで実行してください

-- テスト用ユーザーをauth.usersに追加（実際のUUIDを使用）
-- 注意: 実際のSupabaseダッシュボードでユーザーを作成し、そのUUIDを使用してください

-- テスト用ユーザーのUUID（例：実際のUUIDに置き換えてください）
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (
--   'test-user-uuid-here',
--   'test@cooooster.com',
--   crypt('password123', gen_salt('bf')),
--   now(),
--   now(),
--   now()
-- );

-- テスト用コレクションデータを追加
-- 実際のユーザーUUIDに置き換えて実行してください

INSERT INTO public.collected_areas (user_id, area_name, created_at, updated_at) VALUES
-- 神奈川県の海岸線エリア
('test-user-uuid-here', '横浜市', now(), now()),
('test-user-uuid-here', '鎌倉市', now(), now()),
('test-user-uuid-here', '逗子市', now(), now()),
('test-user-uuid-here', '藤沢市', now(), now()),
('test-user-uuid-here', '茅ヶ崎市', now(), now()),
('test-user-uuid-here', '平塚市', now(), now()),
('test-user-uuid-here', '小田原市', now(), now()),
('test-user-uuid-here', '三浦市', now(), now()),
('test-user-uuid-here', '葉山町', now(), now()),
('test-user-uuid-here', '真鶴町', now(), now()),

-- 千葉県の海岸線エリア
('test-user-uuid-here', '千葉市', now(), now()),
('test-user-uuid-here', '船橋市', now(), now()),
('test-user-uuid-here', '市川市', now(), now()),
('test-user-uuid-here', '浦安市', now(), now()),
('test-user-uuid-here', '習志野市', now(), now()),
('test-user-uuid-here', '八千代市', now(), now()),
('test-user-uuid-here', '佐倉市', now(), now()),
('test-user-uuid-here', '成田市', now(), now()),
('test-user-uuid-here', '銚子市', now(), now()),
('test-user-uuid-here', '館山市', now(), now()),

-- 静岡県の海岸線エリア
('test-user-uuid-here', '静岡市', now(), now()),
('test-user-uuid-here', '浜松市', now(), now()),
('test-user-uuid-here', '沼津市', now(), now()),
('test-user-uuid-here', '熱海市', now(), now()),
('test-user-uuid-here', '伊東市', now(), now()),
('test-user-uuid-here', '下田市', now(), now()),
('test-user-uuid-here', '富士市', now(), now()),
('test-user-uuid-here', '富士宮市', now(), now()),
('test-user-uuid-here', '御前崎市', now(), now()),
('test-user-uuid-here', '菊川市', now(), now()),

-- 愛知県の海岸線エリア
('test-user-uuid-here', '名古屋市', now(), now()),
('test-user-uuid-here', '豊橋市', now(), now()),
('test-user-uuid-here', '岡崎市', now(), now()),
('test-user-uuid-here', '一宮市', now(), now()),
('test-user-uuid-here', '春日井市', now(), now()),
('test-user-uuid-here', '津島市', now(), now()),
('test-user-uuid-here', '碧南市', now(), now()),
('test-user-uuid-here', '刈谷市', now(), now()),
('test-user-uuid-here', '豊田市', now(), now()),
('test-user-uuid-here', '安城市', now(), now()),

-- 三重県の海岸線エリア
('test-user-uuid-here', '津市', now(), now()),
('test-user-uuid-here', '四日市市', now(), now()),
('test-user-uuid-here', '松阪市', now(), now()),
('test-user-uuid-here', '桑名市', now(), now()),
('test-user-uuid-here', '鈴鹿市', now(), now()),
('test-user-uuid-here', '名張市', now(), now()),
('test-user-uuid-here', '尾鷲市', now(), now()),
('test-user-uuid-here', '熊野市', now(), now()),
('test-user-uuid-here', '伊勢市', now(), now()),
('test-user-uuid-here', '鳥羽市', now(), now());

-- 確認用クエリ
-- SELECT * FROM public.collected_areas WHERE user_id = 'test-user-uuid-here' ORDER BY area_name; 