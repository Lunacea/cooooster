'use client'

interface ErrorDisplayProps {
  error: string
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="w-full h-full flex items-center justify-center animate-in fade-in duration-500">
      <div className="text-center p-8 animate-in slide-in-from-bottom-4 duration-700 delay-200">
        <div className="mb-6 animate-in zoom-in duration-500 delay-300">
          <svg className="w-16 h-16 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-red-600 mb-4 animate-in fade-in duration-500 delay-400">データ読み込みエラー</h2>
        <p className="text-gray-600 mb-4 animate-in fade-in duration-500 delay-500">{error}</p>
        <p className="text-sm text-gray-500 animate-in fade-in duration-500 delay-600">
          Supabase Storageに地図データがアップロードされているか確認してください。
        </p>
      </div>
    </div>
  );
} 