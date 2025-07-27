import { integer, pgTable, varchar, text, timestamp, uuid, decimal } from "drizzle-orm/pg-core";

// 収集エリアテーブル
export const collectedAreasTable = pgTable("collected_areas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: uuid("user_id").notNull(), // Supabase AuthのユーザーIDを直接参照
  area_name: varchar({ length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// 投稿テーブル
export const postsTable = pgTable("posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: uuid("user_id").notNull(), // Supabase AuthのユーザーIDを直接参照
  title: varchar({ length: 255 }).notNull(),
  content: text("content").notNull(),
  image_url: text("image_url"), // varchar(500)からtextに変更
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// いいねテーブル
export const likesTable = pgTable("likes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: uuid("user_id").notNull(), // Supabase AuthのユーザーIDを直接参照
  post_id: integer("post_id").notNull().references(() => postsTable.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow(),
});

// ピンテーブル（海岸線の近くでの投稿用）
export const pinsTable = pgTable("pins", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: uuid("user_id").notNull(), // Supabase AuthのユーザーIDを直接参照
  title: varchar({ length: 255 }).notNull(),
  content: text("content").notNull(),
  image_url: text("image_url"), // varchar(500)からtextに変更
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(), // 緯度
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(), // 経度
  prefecture_code: varchar({ length: 10 }).notNull(), // 都道府県コード（JP-13など）
  area_name: varchar({ length: 255 }).notNull(), // エリア名（市町村名など）
  distance_to_coastline: decimal("distance_to_coastline", { precision: 8, scale: 3 }), // 海岸線までの距離（km）
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
