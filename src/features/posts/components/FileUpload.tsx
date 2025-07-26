import * as React from 'react';
import { Button } from '../../../shared/components/ui/button';
import { cn } from '@/shared/libs/utils';
import { Upload, X } from 'lucide-react';

type FileUploadProps = {
  onFileSelect: (file: File | null) => void;
  selectedFile?: File | null;
  accept?: string;
  className?: string;
};

export function FileUpload({
  onFileSelect,
  selectedFile,
  accept = 'image/*',
  className
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  const handleRemove = () => {
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile ? (
        <div className="flex items-center gap-2 p-3 border rounded-md bg-muted">
          <span className="flex-1 text-sm truncate">
            {selectedFile.name}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          画像を選択
        </Button>
      )}
    </div>
  );
}