'use client'

import { Card, CardContent } from '@/shared/components/ui/card'

interface SampleDataWarningProps {
  isUsingSampleData: boolean
}

export function SampleDataWarning({ isUsingSampleData }: SampleDataWarningProps) {
  if (!isUsingSampleData) return null;

  return (
    <div className="absolute top-4 left-4 right-4 z-99 animate-in slide-in-from-top-4 duration-500 delay-300">
      <Card className="shadow-lg border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                サンプルデータを表示中
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                実際の地図データをアップロードしてください。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 