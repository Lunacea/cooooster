import { integer, pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";

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
  image_url: varchar({ length: 500 }),
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
