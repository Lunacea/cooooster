// 境界線のスタイル設定
export const boundaryStyles = {
  default: {
    color: '#22c55e', // 緑色（境界線）
    weight: 1,
    opacity: 0.6,
    fillColor: 'transparent', // 塗りつぶしなし
    fillOpacity: 0
  },
  collected: {
    color: '#005d8f', // 濃い緑色（コレクション済み）
    weight: 2,
    opacity: 0.8,
    fillColor: '#005d8f',
    fillOpacity: 0.2
  },
  coastline: {
    color: '#0ea5e9', // 青色（海岸線）
    weight: 6,
    opacity: 0.8,
    fillColor: 'transparent',
    fillOpacity: 0
  }
} as const; 