ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "collected_areas" DROP CONSTRAINT "collected_areas_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_user_id_users_id_fk";
