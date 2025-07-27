'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
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
    if (percentage >= 90) return { rank: 'S', color: 'text-purple-500', bgColor: 'bg-purple-100' }
    if (percentage >= 80) return { rank: 'A', color: 'text-blue-500', bgColor: 'bg-blue-100' }
    if (percentage >= 60) return { rank: 'B', color: 'text-green-500', bgColor: 'bg-green-100' }
    if (percentage >= 40) return { rank: 'C', color: 'text-yellow-500', bgColor: 'bg-yellow-100' }
    if (percentage >= 20) return { rank: 'D', color: 'text-orange-500', bgColor: 'bg-orange-100' }
    return { rank: 'E', color: 'text-red-500', bgColor: 'bg-red-100' }
  }

  const overallRank = getRank(overallPercentage)

  return (
    <div className="space-y-6">
      {/* 全体ランク表示 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            全体ランク
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${overallRank.bgColor} ${overallRank.color}`}>
                {overallRank.rank}
              </div>
              <div>
                <p className="text-sm font-medium">総合評価</p>
                <p className="text-2xl font-bold">
                  {totalCollected} / {totalAreas}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg">
              {overallPercentage}%
            </Badge>
          </div>
          <Progress value={overallPercentage} className="h-3 mt-4" />
        </CardContent>
      </Card>

      {/* 地方別ランク */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Star className="h-5 w-5" />
          地方別ランク
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regions.map((region) => {
            const rank = getRank(region.percentage)
            return (
              <Card key={region.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${rank.bgColor} ${rank.color}`}>
                        {rank.rank}
                      </div>
                      <div>
                        <p className="font-medium">{region.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {region.collected} / {region.total} エリア
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {region.percentage}%
                    </Badge>
                  </div>
                  <Progress value={region.percentage} className="h-2" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 次の目標 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            次の目標
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {overallPercentage < 100 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">完全制覇</p>
                  <p className="text-sm text-muted-foreground">
                    残り {totalAreas - totalCollected} エリア
                  </p>
                </div>
                <Badge variant="secondary">100%</Badge>
              </div>
            )}
            {overallPercentage < 90 && (
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium">Sランク達成</p>
                  <p className="text-sm text-muted-foreground">
                    あと {Math.ceil((totalAreas * 0.9) - totalCollected)} エリア
                  </p>
                </div>
                <Badge variant="secondary">90%</Badge>
              </div>
            )}
            {overallPercentage < 80 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Aランク達成</p>
                  <p className="text-sm text-muted-foreground">
                    あと {Math.ceil((totalAreas * 0.8) - totalCollected)} エリア
                  </p>
                </div>
                <Badge variant="secondary">80%</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 