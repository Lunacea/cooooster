'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Trophy, Star, Target } from 'lucide-react'

interface RegionProgress {
  name: string
  total: number
  collected: number
  percentage: number
}

interface ProgressChartProps {
  regions: RegionProgress[]
  totalCollected: number
  totalAreas: number
  overallPercentage: number
}

export function ProgressChart({ regions, totalCollected, totalAreas, overallPercentage }: ProgressChartProps) {
  // 進捗率に基づいてランクを決定
  const getRank = (percentage: number) => {
    if (percentage >= 90) return { rank: 'S', color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-200' }
    if (percentage >= 80) return { rank: 'A', color: 'text-bice-blue-600', bgColor: 'bg-bice-blue-100', borderColor: 'border-bice-blue-200' }
    if (percentage >= 60) return { rank: 'B', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' }
    if (percentage >= 40) return { rank: 'C', color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' }
    if (percentage >= 20) return { rank: 'D', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' }
    return { rank: 'E', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' }
  }

  const overallRank = getRank(overallPercentage)

  return (
    <div className="space-y-6">
      {/* 全体ランク表示 */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Trophy className="h-5 w-5 text-bice-blue-500" />
            全体ランク
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${overallRank.bgColor} ${overallRank.color} border-2 ${overallRank.borderColor}`}>
                {overallRank.rank}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">総合評価</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCollected} / {totalAreas}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg bg-bice-blue-200 text-white border-bice-blue-300 font-semibold">
              {overallPercentage}%
            </Badge>
          </div>
          <div className="bg-gray-200 relative h-3 w-full overflow-hidden rounded-full mt-4">
            <div
              className={`bg-bice-blue-500 h-full transition-all duration-300 ease-in-out ${overallPercentage > 0 ? 'w-full' : 'w-0'}`}
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* 地方別ランク */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
          <Star className="h-5 w-5 text-bice-blue-500" />
          地方別ランク
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regions.map((region) => {
            const rank = getRank(region.percentage)
            return (
              <Card key={region.name} className="border-gray-200 bg-white shadow-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${rank.bgColor} ${rank.color} border-2 ${rank.borderColor}`}>
                        {rank.rank}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{region.name}</p>
                        <p className="text-sm text-gray-600">
                          {region.collected} / {region.total} エリア
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-bice-blue-500 text-bice-blue-500 font-medium bg-white">
                      {region.percentage}%
                    </Badge>
                  </div>
                  <div className="bg-gray-200 relative h-2 w-full overflow-hidden rounded-full">
                    <div
                      className={`bg-bice-blue-500 h-full transition-all duration-300 ease-in-out ${region.percentage > 0 ? 'w-full' : 'w-0'}`}
                      style={{ width: `${region.percentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 次の目標 */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Target className="h-5 w-5 text-bice-blue-500" />
            次の目標
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {overallPercentage < 100 && (
              <div className="flex items-center justify-between p-3 bg-bice-blue-50 rounded-lg border border-bice-blue-200">
                <div>
                  <p className="font-medium text-gray-900">完全制覇</p>
                  <p className="text-sm text-gray-600">
                    残り {totalAreas - totalCollected} エリア
                  </p>
                </div>
                <Badge variant="secondary" className="bg-bice-blue-200 text-white border-bice-blue-300 font-semibold">
                  100%
                </Badge>
              </div>
            )}
            {overallPercentage < 90 && (
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div>
                  <p className="font-medium text-gray-900">Sランク達成</p>
                  <p className="text-sm text-gray-600">
                    あと {Math.ceil((totalAreas * 0.9) - totalCollected)} エリア
                  </p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                  90%
                </Badge>
              </div>
            )}
            {overallPercentage < 80 && (
              <div className="flex items-center justify-between p-3 bg-bice-blue-50 rounded-lg border border-bice-blue-200">
                <div>
                  <p className="font-medium text-gray-900">Aランク達成</p>
                  <p className="text-sm text-gray-600">
                    あと {Math.ceil((totalAreas * 0.8) - totalCollected)} エリア
                  </p>
                </div>
                <Badge variant="secondary" className="bg-bice-blue-200 text-white border-bice-blue-300 font-semibold">
                  80%
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="h-24"></div>
    </div>
  )
} 