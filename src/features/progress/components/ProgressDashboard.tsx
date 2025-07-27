'use client'

import { useState, useEffect, useCallback } from 'react'
import { createSupabaseClient } from '@/shared/libs/supabase'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/shared/components/ui/drawer'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { MapPin, Trophy, TrendingUp, Target, BarChart3, Star } from 'lucide-react'
import { ProgressChart } from './ProgressChart'

interface ProgressData {
  totalAreas: number
  collectedAreas: number
  progressPercentage: number
  regions: {
    name: string
    total: number
    collected: number
    percentage: number
  }[]
}

interface ProgressDashboardProps {
  trigger: React.ReactNode
}

export function ProgressDashboard({ trigger }: ProgressDashboardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseClient()

  // 進捗データを取得
  const fetchProgressData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('ログインが必要です')
        return
      }

      // ユーザーのコレクションデータを取得
      const { data: collectedAreas, error: fetchError } = await supabase
        .from('collected_areas')
        .select('area_name')
        .eq('user_id', user.id)

      if (fetchError) {
        console.error('コレクションデータ取得エラー:', fetchError)
        setError('データの取得に失敗しました')
        return
      }

      // 地方別のデータを定義
      const regionData = {
        '関東地方': ['横浜市', '鎌倉市', '逗子市', '藤沢市', '茅ヶ崎市', '平塚市', '小田原市', '三浦市', '葉山町', '真鶴町', '千葉市', '船橋市', '市川市', '浦安市', '習志野市', '八千代市', '佐倉市', '成田市', '銚子市', '館山市'],
        '中部地方': ['静岡市', '浜松市', '沼津市', '熱海市', '伊東市', '下田市', '富士市', '富士宮市', '御前崎市', '菊川市', '名古屋市', '豊橋市', '岡崎市', '一宮市', '春日井市', '津島市', '碧南市', '刈谷市', '豊田市', '安城市', '津市', '四日市市', '松阪市', '桑名市', '鈴鹿市', '名張市', '尾鷲市', '熊野市', '伊勢市', '鳥羽市'],
        '近畿地方': ['和歌山市', '海南市', '御坊市', '田辺市', '新宮市', '紀の川市', '岩出市', '橋本市', '有田市', '串本町', '大阪市', '堺市', '岸和田市', '泉大津市', '泉佐野市', '高石市', '泉南市', '阪南市', '貝塚市', '泉北郡忠岡町', '神戸市', '姫路市', '尼崎市', '明石市', '西宮市', '芦屋市', '伊丹市', '宝塚市', '川西市', '三田市'],
        '中国地方': ['岡山市', '倉敷市', '津山市', '玉野市', '笠岡市', '井原市', '総社市', '高梁市', '新見市', '備前市', '広島市', '呉市', '竹原市', '三原市', '尾道市', '福山市', '府中市', '三次市', '庄原市', '大竹市', '下関市', '宇部市', '山口市', '萩市', '防府市', '下松市', '岩国市', '光市', '長門市', '柳井市']
      }

      const collectedAreaNames = collectedAreas?.map(area => area.area_name) || []
      const totalAreas = Object.values(regionData).flat().length
      const collectedCount = collectedAreaNames.length
      const progressPercentage = Math.round((collectedCount / totalAreas) * 100)

      // 地方別の進捗を計算
      const regions = Object.entries(regionData).map(([name, areas]) => {
        const collected = areas.filter(area => collectedAreaNames.includes(area)).length
        const percentage = Math.round((collected / areas.length) * 100)
        return {
          name,
          total: areas.length,
          collected,
          percentage
        }
      })

      setProgressData({
        totalAreas,
        collectedAreas: collectedCount,
        progressPercentage,
        regions
      })

    } catch (error) {
      console.error('進捗データ取得エラー:', error)
      setError('データの取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  // ドロワーが開かれたときにデータを取得
  useEffect(() => {
    if (isOpen) {
      fetchProgressData()
    }
  }, [isOpen, fetchProgressData])

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              海岸線コレクション進捗
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : error ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-red-500">
                    <Target className="h-8 w-8 mx-auto mb-2" />
                    <p>{error}</p>
                  </div>
                </CardContent>
              </Card>
            ) : progressData ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    概要
                  </TabsTrigger>
                  <TabsTrigger value="chart" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    ランク
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  {/* 全国進捗 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        全国進捗
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">コレクション進捗</p>
                          <p className="text-2xl font-bold">
                            {progressData.collectedAreas} / {progressData.totalAreas}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-lg">
                          {progressData.progressPercentage}%
                        </Badge>
                      </div>
                      <Progress value={progressData.progressPercentage} className="h-3" />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                          残り {progressData.totalAreas - progressData.collectedAreas} エリア
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 地方別進捗 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">地方別進捗</h3>
                    {progressData.regions.map((region) => (
                      <Card key={region.name}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium">{region.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {region.collected} / {region.total} エリア
                              </p>
                            </div>
                            <Badge variant="outline">
                              {region.percentage}%
                            </Badge>
                          </div>
                          <Progress value={region.percentage} className="h-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="chart" className="mt-6">
                  <ProgressChart
                    regions={progressData.regions}
                    totalCollected={progressData.collectedAreas}
                    totalAreas={progressData.totalAreas}
                    overallPercentage={progressData.progressPercentage}
                  />
                </TabsContent>
              </Tabs>
            ) : null}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
} 