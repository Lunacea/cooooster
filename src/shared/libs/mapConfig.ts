import type { Position } from '@/types/map.types'

// 地図の基本設定
export const MAP_CONFIG = {
  // 盛岡を初期位置に設定
  DEFAULT_CENTER: [39.7020, 141.1527] as Position,
  DEFAULT_ZOOM: 10,
  MIN_ZOOM: 1,
  MAX_ZOOM: 10,
} as const

// OpenStreetMapタイルの設定
export const TILE_LAYER = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
} as const
