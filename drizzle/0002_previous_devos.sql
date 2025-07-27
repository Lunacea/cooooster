CREATE TABLE "pins" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pins_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"image_url" varchar(500),
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"prefecture_code" varchar(10) NOT NULL,
	"area_name" varchar(255) NOT NULL,
	"distance_to_coastline" numeric(8, 3),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
