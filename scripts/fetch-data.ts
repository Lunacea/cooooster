// scripts/fetch-data.ts (全国版)

import path from 'path';
import fs from 'fs/promises';

// --- 設定 ---
const overpassApiUrl = "https://overpass-api.de/api/interpreter";

// 海岸線を持つ39都道府県のリスト
const PREFECTURES = [
    { name: "北海道", iso: "JP-01" }, { name: "青森県", iso: "JP-02" },
    { name: "岩手県", iso: "JP-03" }, { name: "宮城県", iso: "JP-04" },
    { name: "秋田県", iso: "JP-05" }, { name: "山形県", iso: "JP-06" },
    { name: "福島県", iso: "JP-07" }, { name: "茨城県", iso: "JP-08" },
    { name: "千葉県", iso: "JP-12" }, { name: "東京都", iso: "JP-13" },
    { name: "神奈川県", iso: "JP-14" }, { name: "新潟県", iso: "JP-15" },
    { name: "富山県", iso: "JP-16" }, { name: "石川県", iso: "JP-17" },
    { name: "福井県", iso: "JP-18" }, { name: "静岡県", iso: "JP-22" },
    { name: "愛知県", iso: "JP-23" }, { name: "三重県", iso: "JP-24" },
    { name: "京都府", iso: "JP-26" }, { name: "大阪府", iso: "JP-27" },
    { name: "兵庫県", iso: "JP-28" }, { name: "和歌山県", iso: "JP-30" },
    { name: "鳥取県", iso: "JP-31" }, { name: "島根県", iso: "JP-32" },
    { name: "岡山県", iso: "JP-33" }, { name: "広島県", iso: "JP-34" },
    { name: "山口県", iso: "JP-35" }, { name: "香川県", iso: "JP-37" },
    { name: "愛媛県", iso: "JP-38" }, { name: "高知県", iso: "JP-39" },
    { name: "福岡県", iso: "JP-40" }, { name: "佐賀県", iso: "JP-41" },
    { name: "長崎県", iso: "JP-42" }, { name: "熊本県", iso: "JP-43" },
    { name: "大分県", iso: "JP-44" }, { name: "宮崎県", iso: "JP-45" },
    { name: "鹿児島県", iso: "JP-46" }, { name: "沖縄県", iso: "JP-47" }
];

// クエリを生成する関数
const getQuery = (isoCode: string, type: 'coastline' | 'admin' | 'islands') => {
    const base = `[out:json][timeout:300]; area["ISO3166-2"="${isoCode}"]->.area;`;
    let target;
    switch (type) {
        case 'coastline':
            target = `way(area.area)["natural"="coastline"];`;
            break;
        case 'admin':
            target = `relation(area.area)["boundary"="administrative"]["admin_level"~"^[789]$"];`;
            break;
        case 'islands':
            target = `relation(area.area)["place"~"^(island|islet)$"];`;
            break;
    }
    return `${base} (${target}); (._;>;); out geom;`;
};

async function fetchData(query: string) {
    const response = await fetch(overpassApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`サーバーエラー: ${response.status} ${response.statusText}\n${errorBody}`);
    }
    return response.json();
}

async function main() {
    console.log(`--- 日本全国のデータ取得を開始します ---`);
    const rawDataDir = path.join(import.meta.dir, 'raw_data');
    await fs.mkdir(rawDataDir, { recursive: true });

    for (const pref of PREFECTURES) {
        console.log(`\n--- ${pref.name} (${pref.iso}) の処理を開始 ---`);
        const prefDir = path.join(rawDataDir, pref.iso);
        await fs.mkdir(prefDir, { recursive: true });

        try {
            const coastlineQuery = getQuery(pref.iso, 'coastline');
            const coastlineData = await fetchData(coastlineQuery);
            await Bun.write(path.join(prefDir, 'coastline.geojson'), JSON.stringify(coastlineData));
            console.log(`✅ ${pref.name} の海岸線データを保存しました。`);

            const adminQuery = getQuery(pref.iso, 'admin');
            const adminData = await fetchData(adminQuery);
            await Bun.write(path.join(prefDir, 'boundaries_admin.geojson'), JSON.stringify(adminData));
            console.log(`✅ ${pref.name} の市町村データを保存しました。`);

            const islandQuery = getQuery(pref.iso, 'islands');
            const islandData = await fetchData(islandQuery);
            await Bun.write(path.join(prefDir, 'boundaries_islands.geojson'), JSON.stringify(islandData));
            console.log(`✅ ${pref.name} の島データを保存しました。`);
            
            // サーバーに負荷をかけすぎないように少し待つ
            await new Promise(resolve => setTimeout(resolve, 5000)); 

        } catch (error) {
            console.error(`❌ ${pref.name} のデータ取得中にエラーが発生しました:`, error);
        }
    }

    console.log(`\n--- 全てのデータ取得が完了しました！ ---`);
    console.log(`次は 'bun run scripts/index.ts' を実行してデータを整形・アップロードしてください。`);
}

main();
