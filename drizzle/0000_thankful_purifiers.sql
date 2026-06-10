CREATE TYPE "public"."weight_unit" AS ENUM('g', 'ml');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "dishes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "dishes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_url" text,
	"weight" integer NOT NULL,
	"weight_unit" "weight_unit" DEFAULT 'g' NOT NULL,
	"price_cents" integer NOT NULL,
	"allergens" text[] DEFAULT '{}'::text[] NOT NULL,
	"calories" integer,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;