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