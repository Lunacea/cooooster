// 地図の位置情報を表す型
export type Position = [number, number] // [緯度, 経度]

// マーカーの情報を表す型
export interface MarkerData {
  id: string
  position: Position
  title?: string
  description?: string
}

// 地図の設定を表す型
export interface MapConfig {
  center: Position
  zoom: number
  scrollWheelZoom?: boolean
} 