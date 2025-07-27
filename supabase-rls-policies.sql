-- Enable Row Level Security (RLS)
ALTER TABLE public.collected_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for collected_areas table
CREATE POLICY "Users can view their own collected areas" ON public.collected_areas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own collected areas" ON public.collected_areas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collected areas" ON public.collected_areas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collected areas" ON public.collected_areas
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for posts table
CREATE POLICY "Users can view all posts" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for likes table
CREATE POLICY "Users can view all likes" ON public.likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON public.likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON public.likes
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_collected_areas_user_id ON public.collected_areas(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id); 

-- テスト用コレクションデータを追加
INSERT INTO public.collected_areas (user_id, area_name, created_at, updated_at) VALUES
-- 神奈川県の海岸線エリア
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '横浜市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '鎌倉市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '逗子市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '藤沢市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '茅ヶ崎市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '平塚市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '小田原市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '三浦市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '葉山町', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '真鶴町', now(), now()),
-- 千葉県の海岸線エリア
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '千葉市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '船橋市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '市川市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '浦安市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '習志野市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '八千代市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '佐倉市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '成田市', now(), now()),
('ab04fc99-c1bc-4268-93a6-18c2fc9c21e4', '館山市', now(), now()); 