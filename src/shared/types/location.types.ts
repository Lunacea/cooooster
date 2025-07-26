/**
 * 位置情報関連の型定義
 */

// 緯度経度の位置情報
export type Location = {
  latitude: number;
  longitude: number;
};

// エリア情報（市町村名付き位置情報）
export type AreaLocation = Location & {
  area: string; // 市町村名
};

// 位置情報取得の状態
export type LocationState = {
  location: Location | null;
  loading: boolean;
  error: string | null;
};