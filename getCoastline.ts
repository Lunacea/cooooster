// getCoastline.ts
import { writeFile } from "fs/promises";

export const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// データを取得したい範囲をbbox(南西の緯度経度, 北東の緯度経度)で指定
// この例では伊豆半島周辺を指定しています
const query = `
  [out:json][timeout:30];
  way[natural=coastline](34.5, 138.7, 35.2, 139.2);
  out geom;
`;

console.log("🌊 海岸線データを取得中...");

try {
  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    body: query,
  });

  if (!response.ok) {
    throw new Error(`APIエラー: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // 取得したデータを整形してファイルに保存
  await writeFile("coastline.json", JSON.stringify(data, null, 2));

  console.log("✅ データを coastline.json に保存しました！");
} catch (error) {
  console.error("❌ エラーが発生しました:", error);
}