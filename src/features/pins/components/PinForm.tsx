'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FileUpload } from '../../posts/components/FileUpload';
import { useCreatePin } from '../hooks/useCreatePin';
import type { PinFormData } from '../types/pin.types';
import { toast } from 'sonner';

interface PinFormProps {
  locationData: {
    latitude: number;
    longitude: number;
    prefecture_code: string;
    area_name: string;
    distance_to_coastline?: number;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PinForm({ locationData, onSuccess, onCancel }: PinFormProps) {
  const [formData, setFormData] = useState<PinFormData>({
    title: '',
    content: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const { createPin, isLoading, error } = useCreatePin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('タイトルと内容を入力してください');
      return;
    }

    const submitData: PinFormData = {
      ...formData,
      image: image || undefined
    };

    const result = await createPin(submitData, locationData);

    if (result.success) {
      onSuccess?.();
    } else {
      toast.error(result.error || '投稿に失敗しました');
    }
  };

  const handleInputChange = (field: keyof PinFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle id="pin-form-title" className="text-center">海岸線の近くでピンを立てる</CardTitle>
        <p className="text-sm text-gray-600 text-center">
          {locationData.area_name} ({locationData.distance_to_coastline ? `${locationData.distance_to_coastline}km` : '距離不明'})
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="タイトル"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">内容 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="共有したいことを入力しましょう！"
              rows={4}
              required
            />
          </div>

          <div>
            <Label>画像（任意）</Label>
            <FileUpload
              onFileSelect={setImage}
              selectedFile={image}
              accept="image/*"
            />
          </div>

          {error && (
            <div className="text-ut-orange-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? '投稿中...' : 'ピンを投稿'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                キャンセル
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 