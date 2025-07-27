'use client'

import { useState, useEffect, useCallback } from 'react'
import { createSupabaseClient } from '@/shared/libs/supabase'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/shared/components/ui/drawer'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { MapPin, Trophy, TrendingUp, Target, BarChart3, Star, X } from 'lucide-react'
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

      // 地方別のデータを定義（全国対応）
      const regionData = {
        '北海道': ['札幌市', '函館市', '小樽市', '室蘭市', '苫小牧市', '江別市', '千歳市', '石狩市', '北広島市', '恵庭市', '北見市', '旭川市', '帯広市', '釧路市', '網走市', '稚内市', '留萌市', '名寄市', '根室市', '富良野市'],
        '東北地方': ['青森市', '弘前市', '八戸市', '黒石市', '五所川原市', '十和田市', '三沢市', 'むつ市', 'つがる市', '平川市', '秋田市', '能代市', '横手市', '大館市', '男鹿市', '湯沢市', '鹿角市', '由利本荘市', '潟上市', '大仙市', '仙台市', '石巻市', '塩竈市', '気仙沼市', '白石市', '名取市', '角田市', '多賀城市', '岩沼市', '登米市', '栗原市', '東松島市', '大崎市', '富谷市', '山形市', '米沢市', '鶴岡市', '酒田市', '新庄市', '寒河江市', '上山市', '村山市', '長井市', '天童市', '東根市', '尾花沢市', '南陽市', '福島市', '会津若松市', '郡山市', 'いわき市', '白河市', '須賀川市', '喜多方市', '相馬市', '二本松市', '田村市', '南相馬市', '伊達市', '本宮市'],
        '関東地方': ['横浜市', '鎌倉市', '逗子市', '藤沢市', '茅ヶ崎市', '平塚市', '小田原市', '三浦市', '葉山町', '真鶴町', '千葉市', '船橋市', '市川市', '浦安市', '習志野市', '八千代市', '佐倉市', '成田市', '銚子市', '館山市'],
        '中部地方': ['静岡市', '浜松市', '沼津市', '熱海市', '伊東市', '下田市', '富士市', '富士宮市', '御前崎市', '菊川市', '名古屋市', '豊橋市', '岡崎市', '一宮市', '春日井市', '津島市', '碧南市', '刈谷市', '豊田市', '安城市', '津市', '四日市市', '松阪市', '桑名市', '鈴鹿市', '名張市', '尾鷲市', '熊野市', '伊勢市', '鳥羽市'],
        '近畿地方': ['和歌山市', '海南市', '御坊市', '田辺市', '新宮市', '紀の川市', '岩出市', '橋本市', '有田市', '串本町', '大阪市', '堺市', '岸和田市', '泉大津市', '泉佐野市', '高石市', '泉南市', '阪南市', '貝塚市', '泉北郡忠岡町', '神戸市', '姫路市', '尼崎市', '明石市', '西宮市', '芦屋市', '伊丹市', '宝塚市', '川西市', '三田市'],
        '中国地方': ['岡山市', '倉敷市', '津山市', '玉野市', '笠岡市', '井原市', '総社市', '高梁市', '新見市', '備前市', '広島市', '呉市', '竹原市', '三原市', '尾道市', '福山市', '府中市', '三次市', '庄原市', '大竹市', '下関市', '宇部市', '山口市', '萩市', '防府市', '下松市', '岩国市', '光市', '長門市', '柳井市'],
        '四国地方': ['徳島市', '鳴門市', '小松島市', '阿南市', '吉野川市', '阿波市', '美馬市', '三好市', '松山市', '今治市', '宇和島市', '八幡浜市', '新居浜市', '西条市', '大洲市', '伊予市', '四国中央市', '西予市', '上島町', '高松市', '丸亀市', '坂出市', '善通寺市', '観音寺市', 'さぬき市', '東かがわ市', '三豊市', '高知市', '室戸市', '安芸市', '南国市', '土佐市', '須崎市', '宿毛市', '土佐清水市', '四万十市', '香南市', '香美市'],
        '九州地方': ['北九州市', '福岡市', '大牟田市', '久留米市', '直方市', '飯塚市', '田川市', '柳川市', '八女市', '筑後市', '大川市', '行橋市', '豊前市', '中間市', '小郡市', '筑紫野市', '春日市', '大野城市', '宗像市', '太宰府市', '古賀市', '福津市', 'うきは市', '宮若市', '嘉麻市', '朝倉市', 'みやま市', '糸島市', '佐賀市', '唐津市', '鳥栖市', '多久市', '伊万里市', '武雄市', '鹿島市', '小城市', '嬉野市', '神埼市', '長崎市', '佐世保市', '島原市', '諫早市', '大村市', '平戸市', '松浦市', '対馬市', '五島市', '西海市', '雲仙市', '南島原市', '熊本市', '八代市', '人吉市', '荒尾市', '水俣市', '玉名市', '山鹿市', '菊池市', '宇土市', '上天草市', '宇城市', '阿蘇市', '天草市', '合志市', '大分市', '別府市', '中津市', '日田市', '佐伯市', '臼杵市', '津久見市', '竹田市', '豊後高田市', '杵築市', '宇佐市', '豊後大野市', '由布市', '国東市', '宮崎市', '都城市', '延岡市', '日南市', '小林市', '日向市', '串間市', '西都市', 'えびの市', '鹿児島市', '鹿屋市', '枕崎市', '阿久根市', '出水市', '指宿市', '西之表市', '垂水市', '薩摩川内市', '日置市', '曽於市', '霧島市', 'いちき串木野市', '南さつま市', '志布志市', '奄美市', '南九州市', '伊佐市', '姶良市', '那覇市', '宜野湾市', '石垣市', '浦添市', '名護市', '糸満市', '沖縄市', '豊見城市', 'うるま市', '宮古島市', '南城市']
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
      <DrawerContent className="max-h-[88vh] overflow-hidden">
        <div className="mx-auto w-full max-w-2xl h-[88vh] flex flex-col">
          <DrawerHeader className="border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Trophy className="h-5 w-5 text-bice-blue-500" />
                海岸線コレクション進捗
              </DrawerTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                aria-label="進捗ダッシュボードを閉じる"
                title="閉じる"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4 pb-12">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : error ? (
              <Card className="border-gray-200 bg-white">
                <CardContent className="pt-6">
                  <div className="text-center text-red-500">
                    <Target className="h-8 w-8 mx-auto mb-2" />
                    <p>{error}</p>
                  </div>
                </CardContent>
              </Card>
            ) : progressData ? (
              <Tabs defaultValue="overview" className="w-full">
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 border border-gray-200">
                    <TabsTrigger
                      value="overview"
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-bice-blue-600 data-[state=active]:shadow-sm"
                    >
                      <BarChart3 className="h-4 w-4" />
                      概要
                    </TabsTrigger>
                    <TabsTrigger
                      value="chart"
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-bice-blue-600 data-[state=active]:shadow-sm"
                    >
                      <Star className="h-4 w-4" />
                      ランク
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* 全国進捗 */}
                    <Card className="border-gray-200 bg-white shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                          <MapPin className="h-5 w-5 text-bice-blue-500" />
                          全国進捗
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-700">コレクション進捗</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {progressData.collectedAreas} / {progressData.totalAreas}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-lg bg-bice-blue-200 text-white border-bice-blue-300 font-semibold">
                            {progressData.progressPercentage}%
                          </Badge>
                        </div>
                        <div className="bg-gray-200 relative h-3 w-full overflow-hidden rounded-full">
                          <div
                            className={`bg-bice-blue-500 h-full transition-all duration-300 ease-in-out ${progressData.progressPercentage > 0 ? 'w-full' : 'w-0'}`}
                            style={{ width: `${progressData.progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingUp className="h-4 w-4" />
                          <span>
                            残り {progressData.totalAreas - progressData.collectedAreas} エリア
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 地方別進捗 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">地方別進捗</h3>
                      {progressData.regions.map((region) => (
                        <Card key={region.name} className="border-gray-200 bg-white shadow-sm">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="font-medium text-gray-900">{region.name}</p>
                                <p className="text-sm text-gray-600">
                                  {region.collected} / {region.total} エリア
                                </p>
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
                      ))}
                    </div>
                    <div className="h-24"></div> {/* スクロール用の余白 */}
                  </TabsContent>

                  <TabsContent value="chart" className="mt-6">
                    <ProgressChart
                      regions={progressData.regions}
                      totalCollected={progressData.collectedAreas}
                      totalAreas={progressData.totalAreas}
                      overallPercentage={progressData.progressPercentage}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            ) : null}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
