import type { Position } from '@/types/map.types';

// 都道府県の境界データ（簡略化版）
interface PrefectureBoundary {
  code: string;
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// 地域定義
interface Region {
  name: string;
  prefectures: string[];
  description: string;
}

// 主要な都道府県の境界データ
const PREFECTURE_BOUNDARIES: PrefectureBoundary[] = [
  {
    code: 'JP-13',
    name: '東京都',
    bounds: { north: 35.9, south: 35.4, east: 140.0, west: 139.4 }
  },
  {
    code: 'JP-14',
    name: '神奈川県',
    bounds: { north: 35.8, south: 35.1, east: 139.8, west: 139.0 }
  },
  {
    code: 'JP-12',
    name: '千葉県',
    bounds: { north: 36.0, south: 35.0, east: 140.8, west: 139.8 }
  },
  {
    code: 'JP-11',
    name: '埼玉県',
    bounds: { north: 36.5, south: 35.8, east: 140.0, west: 139.0 }
  },
  {
    code: 'JP-27',
    name: '大阪府',
    bounds: { north: 35.0, south: 34.3, east: 135.8, west: 135.2 }
  },
  {
    code: 'JP-26',
    name: '京都府',
    bounds: { north: 35.8, south: 34.8, east: 136.2, west: 135.4 }
  },
  {
    code: 'JP-28',
    name: '兵庫県',
    bounds: { north: 35.8, south: 34.2, east: 135.8, west: 134.2 }
  },
  {
    code: 'JP-23',
    name: '愛知県',
    bounds: { north: 35.5, south: 34.5, east: 137.8, west: 136.8 }
  },
  {
    code: 'JP-22',
    name: '静岡県',
    bounds: { north: 35.8, south: 34.5, east: 139.2, west: 137.8 }
  },
  {
    code: 'JP-01',
    name: '北海道',
    bounds: { north: 45.8, south: 41.2, east: 145.8, west: 139.2 }
  },
  {
    code: 'JP-02',
    name: '青森県',
    bounds: { north: 41.8, south: 40.2, east: 141.8, west: 140.2 }
  },
  {
    code: 'JP-03',
    name: '岩手県',
    bounds: { north: 41.2, south: 38.5, east: 142.5, west: 140.5 }
  },
  {
    code: 'JP-04',
    name: '宮城県',
    bounds: { north: 39.2, south: 37.8, east: 141.8, west: 140.8 }
  },
  {
    code: 'JP-05',
    name: '秋田県',
    bounds: { north: 40.2, south: 38.8, east: 141.2, west: 139.8 }
  },
  {
    code: 'JP-06',
    name: '山形県',
    bounds: { north: 39.2, south: 37.8, east: 140.8, west: 139.8 }
  },
  {
    code: 'JP-07',
    name: '福島県',
    bounds: { north: 38.2, south: 36.8, east: 141.2, west: 139.8 }
  },
  {
    code: 'JP-08',
    name: '茨城県',
    bounds: { north: 36.8, south: 35.8, east: 141.2, west: 139.8 }
  },
  {
    code: 'JP-09',
    name: '栃木県',
    bounds: { north: 37.2, south: 36.2, east: 140.2, west: 139.2 }
  },
  {
    code: 'JP-10',
    name: '群馬県',
    bounds: { north: 37.2, south: 36.2, east: 139.8, west: 138.8 }
  },
  {
    code: 'JP-15',
    name: '新潟県',
    bounds: { north: 38.2, south: 36.8, east: 139.8, west: 137.8 }
  },
  {
    code: 'JP-16',
    name: '富山県',
    bounds: { north: 37.2, south: 36.2, east: 138.2, west: 136.8 }
  },
  {
    code: 'JP-17',
    name: '石川県',
    bounds: { north: 37.8, south: 36.2, east: 137.8, west: 136.2 }
  },
  {
    code: 'JP-18',
    name: '福井県',
    bounds: { north: 36.8, south: 35.2, east: 136.8, west: 135.2 }
  },
  {
    code: 'JP-19',
    name: '山梨県',
    bounds: { north: 36.2, south: 35.2, east: 139.2, west: 138.2 }
  },
  {
    code: 'JP-20',
    name: '長野県',
    bounds: { north: 37.2, south: 35.2, east: 139.2, west: 137.2 }
  },
  {
    code: 'JP-21',
    name: '岐阜県',
    bounds: { north: 36.8, south: 35.2, east: 137.8, west: 136.2 }
  },
  {
    code: 'JP-24',
    name: '三重県',
    bounds: { north: 35.8, south: 34.2, east: 137.2, west: 135.8 }
  },
  {
    code: 'JP-25',
    name: '滋賀県',
    bounds: { north: 35.8, south: 34.8, east: 136.8, west: 135.8 }
  },
  {
    code: 'JP-29',
    name: '奈良県',
    bounds: { north: 35.2, south: 34.2, east: 136.2, west: 135.2 }
  },
  {
    code: 'JP-30',
    name: '和歌山県',
    bounds: { north: 34.8, south: 33.2, east: 136.2, west: 135.2 }
  },
  {
    code: 'JP-31',
    name: '鳥取県',
    bounds: { north: 36.2, south: 35.2, east: 134.8, west: 133.8 }
  },
  {
    code: 'JP-32',
    name: '島根県',
    bounds: { north: 36.2, south: 34.2, east: 134.2, west: 132.2 }
  },
  {
    code: 'JP-33',
    name: '岡山県',
    bounds: { north: 35.8, south: 34.2, east: 134.8, west: 133.2 }
  },
  {
    code: 'JP-34',
    name: '広島県',
    bounds: { north: 35.8, south: 34.2, east: 133.8, west: 132.2 }
  },
  {
    code: 'JP-35',
    name: '山口県',
    bounds: { north: 35.2, south: 33.8, east: 132.8, west: 130.8 }
  },
  {
    code: 'JP-36',
    name: '徳島県',
    bounds: { north: 34.8, south: 33.2, east: 135.2, west: 133.8 }
  },
  {
    code: 'JP-37',
    name: '香川県',
    bounds: { north: 34.8, south: 34.2, east: 134.8, west: 133.8 }
  },
  {
    code: 'JP-38',
    name: '愛媛県',
    bounds: { north: 35.2, south: 33.2, east: 134.2, west: 132.2 }
  },
  {
    code: 'JP-39',
    name: '高知県',
    bounds: { north: 34.2, south: 32.8, east: 134.2, west: 132.8 }
  },
  {
    code: 'JP-40',
    name: '福岡県',
    bounds: { north: 34.2, south: 33.2, east: 131.8, west: 130.2 }
  },
  {
    code: 'JP-41',
    name: '佐賀県',
    bounds: { north: 34.2, south: 33.2, east: 130.8, west: 129.8 }
  },
  {
    code: 'JP-42',
    name: '長崎県',
    bounds: { north: 34.8, south: 32.2, east: 130.8, west: 128.2 }
  },
  {
    code: 'JP-43',
    name: '熊本県',
    bounds: { north: 33.8, south: 32.2, east: 131.8, west: 130.2 }
  },
  {
    code: 'JP-44',
    name: '大分県',
    bounds: { north: 34.2, south: 32.8, east: 132.2, west: 130.8 }
  },
  {
    code: 'JP-45',
    name: '宮崎県',
    bounds: { north: 33.2, south: 31.8, east: 132.2, west: 130.8 }
  },
  {
    code: 'JP-46',
    name: '鹿児島県',
    bounds: { north: 32.8, south: 30.2, east: 131.2, west: 129.2 }
  },
  {
    code: 'JP-47',
    name: '沖縄県',
    bounds: { north: 27.2, south: 24.2, east: 129.2, west: 123.2 }
  }
];

// 地域定義
const REGIONS: Region[] = [
  {
    name: '北海道・東北',
    prefectures: ['JP-01', 'JP-02', 'JP-03', 'JP-04', 'JP-05', 'JP-06', 'JP-07'],
    description: '北海道と東北6県の海岸線を表示'
  },
  {
    name: '関東',
    prefectures: ['JP-08', 'JP-09', 'JP-10', 'JP-11', 'JP-12', 'JP-13', 'JP-14'],
    description: '関東7都県の海岸線を表示'
  },
  {
    name: '中部',
    prefectures: ['JP-15', 'JP-16', 'JP-17', 'JP-18', 'JP-19', 'JP-20', 'JP-21', 'JP-22', 'JP-23'],
    description: '中部9県の海岸線を表示'
  },
  {
    name: '近畿',
    prefectures: ['JP-24', 'JP-25', 'JP-26', 'JP-27', 'JP-28', 'JP-29', 'JP-30'],
    description: '近畿7府県の海岸線を表示'
  },
  {
    name: '中国',
    prefectures: ['JP-31', 'JP-32', 'JP-33', 'JP-34', 'JP-35'],
    description: '中国5県の海岸線を表示'
  },
  {
    name: '四国',
    prefectures: ['JP-36', 'JP-37', 'JP-38', 'JP-39'],
    description: '四国4県の海岸線を表示'
  },
  {
    name: '九州・沖縄',
    prefectures: ['JP-40', 'JP-41', 'JP-42', 'JP-43', 'JP-44', 'JP-45', 'JP-46', 'JP-47'],
    description: '九州7県と沖縄県の海岸線を表示'
  }
];

/**
 * 座標から都道府県を判定する
 * @param position 座標 [latitude, longitude]
 * @returns 都道府県コード（見つからない場合は'JP-13'を返す）
 */
export function getPrefectureFromPosition(position: Position): string {
  const [lat, lng] = position;
  console.log(`都道府県判定: 座標 [${lat}, ${lng}]`);
  
  for (const prefecture of PREFECTURE_BOUNDARIES) {
    const { bounds } = prefecture;
    const inBounds = lat >= bounds.south &&
                     lat <= bounds.north &&
                     lng >= bounds.west &&
                     lng <= bounds.east;
    
    console.log(`都道府県判定チェック: ${prefecture.name} (${prefecture.code}) - bounds: [${bounds.south}, ${bounds.north}, ${bounds.west}, ${bounds.east}] - inBounds: ${inBounds}`);
    
    if (inBounds) {
      console.log(`都道府県判定結果: ${prefecture.name} (${prefecture.code})`);
      return prefecture.code;
    }
  }
  
  console.log(`都道府県判定結果: 見つからないため東京都をデフォルト`);
  // 見つからない場合は東京都をデフォルトとする
  return 'JP-13';
}

/**
 * 都道府県コードから名前を取得する
 * @param code 都道府県コード
 * @returns 都道府県名
 */
export function getPrefectureName(code: string): string {
  const prefecture = PREFECTURE_BOUNDARIES.find(p => p.code === code);
  return prefecture?.name || '東京都';
}

/**
 * 都道府県コードから地域を取得する
 * @param code 都道府県コード
 * @returns 地域情報
 */
export function getRegionFromPrefecture(code: string): Region | null {
  return REGIONS.find(region => region.prefectures.includes(code)) || null;
}

/**
 * 地域名から地域情報を取得する
 * @param regionName 地域名
 * @returns 地域情報
 */
export function getRegionByName(regionName: string): Region | null {
  return REGIONS.find(region => region.name === regionName) || null;
}

/**
 * 利用可能な都道府県のリストを取得する
 * @returns 都道府県のリスト
 */
export function getAvailablePrefectures(): Array<{ code: string; name: string }> {
  return PREFECTURE_BOUNDARIES.map(p => ({
    code: p.code,
    name: p.name
  }));
}

/**
 * 利用可能な地域のリストを取得する
 * @returns 地域のリスト
 */
export function getAvailableRegions(): Array<{ name: string; description: string }> {
  return REGIONS.map(r => ({
    name: r.name,
    description: r.description
  }));
}

/**
 * 都道府県が海なし県かどうかを判定する
 * @param code 都道府県コード
 * @returns 海なし県の場合true
 */
export function isLandlockedPrefecture(code: string): boolean {
  const landlockedPrefectures = [
    'JP-09', // 栃木県
    'JP-10', // 群馬県
    'JP-19', // 山梨県
    'JP-20', // 長野県
    'JP-25', // 滋賀県
    'JP-29', // 奈良県
    'JP-31', // 鳥取県
    'JP-32', // 島根県
  ];
  return landlockedPrefectures.includes(code);
} 