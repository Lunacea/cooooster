import * as React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Input } from '@/shared/components/ui/input';
import { FileUpload } from '@/shared/components/ui/file-upload';
import { validateImageFile } from '@/shared/libs/image-utils';
import type { PostFormData } from '@/features/posts/types/post.types';

type PostFormProps = {
  onSubmit: (data: PostFormData) => void;
  loading?: boolean;
};

export function PostForm({ onSubmit, loading = false }: PostFormProps) {
  const [content, setContent] = React.useState('');
  const [area, setArea] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError('投稿内容を入力してください');
      return;
    }

    if (!area.trim()) {
      setError('エリア名を入力してください');
      return;
    }

    if (selectedFile) {
      const validation = validateImageFile(selectedFile);
      if (!validation.valid) {
        setError(validation.error || '');
        return;
      }
    }

    onSubmit({
      content: content.trim(),
      area: area.trim(),
      latitude: null, // 位置情報は未実装
      longitude: null,
      image: selectedFile || undefined,
    });

    // フォームをリセット
    setContent('');
    setArea('');
    setSelectedFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="area" className="block text-sm font-medium mb-1">
          エリア名
        </label>
        <Input
          id="area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="例: 湘南海岸"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          投稿内容
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="海岸線の魅力を教えてください..."
          rows={4}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          画像（任意）
        </label>
        <FileUpload
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? '投稿中...' : '投稿する'}
      </Button>
    </form>
  );
}