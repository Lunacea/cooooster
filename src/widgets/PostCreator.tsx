import * as React from 'react';
import { PostForm } from '@/features/posts/components/PostForm';
import { PostList } from '@/features/posts/components/PostList';
import { useCreatePost } from '@/features/posts/hooks/useCreatePost';
import { usePosts } from '@/features/posts/hooks/usePosts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import type { PostFormData } from '@/features/posts/types/post.types';

type PostCreatorProps = {
  userId: string; // 現在のユーザーID
};

export function PostCreator({ userId }: PostCreatorProps) {
  const [activeTab, setActiveTab] = React.useState('list');
  const { submit, loading: createLoading, error: createError } = useCreatePost();
  const { posts, loading: postsLoading, error: postsError, refresh } = usePosts();

  const handleSubmit = async (formData: PostFormData) => {
    const result = await submit(formData, userId);
    
    if (result.success) {
      // 投稿成功時は一覧タブに切り替えて投稿を更新
      setActiveTab('list');
      refresh();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">投稿一覧</TabsTrigger>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-1" />
            新規投稿
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">海岸線投稿</h2>
              <Button
                onClick={() => setActiveTab('create')}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                投稿する
              </Button>
            </div>
            
            <PostList
              posts={posts}
              currentUserId={userId}
              loading={postsLoading}
              error={postsError}
              onRefresh={refresh}
            />
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">新しい投稿</h2>
            
            {createError && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm">{createError}</p>
              </div>
            )}
            
            <PostForm
              onSubmit={handleSubmit}
              loading={createLoading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}