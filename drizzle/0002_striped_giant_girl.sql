CREATE TABLE "dish_tags" (
	"dish_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "dish_tags_dish_id_tag_id_pk" PRIMARY KEY("dish_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "dishes" ALTER COLUMN "allergens" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "dish_tags" ADD CONSTRAINT "dish_tags_dish_id_dishes_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dish_tags" ADD CONSTRAINT "dish_tags_tag_id_custom_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."custom_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dishes" DROP COLUMN "tags";