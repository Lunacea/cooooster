// scripts/index.ts (全国版)

import * as turf from '@turf/turf';
import path from 'path';
import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js'
import type { Feature, FeatureCollection, LineString, Polygon, MultiPolygon, Position } from 'geojson';

// --- Supabase設定 ---
// .env.localファイルなどに環境変数を設定してください
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)
const STORAGE_BUCKET = 'map-data'; // あなたが作成したBucket名

// --- 型定義 ---
interface OverpassElement { type: 'way' | 'relation' | 'node'; id: number; geometry?: { lat: number; lon: number }[]; tags?: Record<string, string>; members?: { type: 'way'; ref: number; role: string }[]; }
interface OverpassJson { elements: OverpassElement[]; }

// --- ファイルパス設定 ---
const rawDataDir = path.join(import.meta.dir, 'raw_data');

// Overpassの組立説明書から、精密なポリゴンを組み立てる関数
function assemblePolygons(data: OverpassJson): FeatureCollection<Polygon | MultiPolygon> {
    // (この関数の中身は前のバージョンと同じです)
    const wayMap = new Map<number, Position[]>();
    data.elements.forEach(element => {
        if (element.type === 'way' && element.geometry && element.geometry.length >= 2) {
            wayMap.set(element.id, element.geometry.map(p => [p.lon, p.lat]));
        }
    });

    const features: Feature<Polygon | MultiPolygon>[] = [];
    data.elements.forEach(element => {
        if (element.type === 'relation' && element.members) {
            const lines: Feature<LineString>[] = [];
            for (const member of element.members) {
                if (member.type === 'way') {
                    const wayCoords = wayMap.get(member.ref);
                    if (wayCoords) { lines.push(turf.lineString(wayCoords)); }
                }
            }
            if (lines.length > 0) {
                try {
                    const lineCollection = turf.featureCollection(lines);
                    const polygonized = turf.polygonize(lineCollection);
                    polygonized.features.forEach(poly => {
                        if (poly && poly.geometry && turf.area(poly) > 0) {
                            poly.properties = element.tags || {};
                            features.push(poly);
                        }
                    });
                } catch (e) { console.error(e) }
            }
        }
    });
    return turf.featureCollection(features);
}

async function uploadToSupabase(filePath: string, data: string | Buffer) {
    const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, data, { upsert: true, contentType: 'application/json' });
    if (error) {
        throw error;
    }
}

async function main() {
    console.log(`--- 全国データの整形・アップロード処理を開始します ---`);
    const prefectures = await fs.readdir(rawDataDir);

    for (const prefIso of prefectures) {
        console.log(`\n--- ${prefIso} の処理を開始 ---`);
        const prefDir = path.join(rawDataDir, prefIso);
        try {
            // --- 境界線データの整形とアップロード ---
            const rawAdminData: OverpassJson = JSON.parse(await fs.readFile(path.join(prefDir, 'boundaries_admin.geojson'), 'utf-8'));
            const rawIslandData: OverpassJson = JSON.parse(await fs.readFile(path.join(prefDir, 'boundaries_islands.geojson'), 'utf-8'));
            const combinedRawBoundaries: OverpassJson = { elements: [...rawAdminData.elements, ...rawIslandData.elements] };
            
            const boundariesData = assemblePolygons(combinedRawBoundaries);
            const validBoundaries = boundariesData.features.filter(f => !!f.properties?.name);
            const boundariesJsonString = JSON.stringify(turf.featureCollection(validBoundaries));
            await uploadToSupabase(`${prefIso}/boundaries_processed.geojson`, boundariesJsonString);
            console.log(`✅ ${prefIso}: ${validBoundaries.length} 件の境界線データをSupabaseにアップロードしました。`);

            // --- 海岸線データの整形とアップロード ---
            const rawCoastlineData: OverpassJson = JSON.parse(await fs.readFile(path.join(prefDir, 'coastline.geojson'), 'utf-8'));
            const coastlineSegments: Feature<LineString>[] = rawCoastlineData.elements
                .filter((e): e is OverpassElement & { geometry: { lat: number; lon: number }[] } => e.type === 'way' && !!e.geometry)
                .map(e => turf.lineString(e.geometry.map(p => [p.lon, p.lat])));
            const multiLine = turf.multiLineString(coastlineSegments.map(seg => seg.geometry.coordinates));
            const coastlineJsonString = JSON.stringify(multiLine);
            await uploadToSupabase(`${prefIso}/coastline_processed.geojson`, coastlineJsonString);
            console.log(`✅ ${prefIso}: 海岸線データをSupabaseにアップロードしました。`);

        } catch (error) {
            console.error(`❌ ${prefIso} の処理中にエラーが発生しました:`, error);
        }
    }
    console.log(`\n--- 全てのデータ処理・アップロードが完了しました！ ---`);
}

main();
