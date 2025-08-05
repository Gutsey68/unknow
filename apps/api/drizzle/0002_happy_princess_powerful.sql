CREATE TABLE "daily_log" (
	"log_id" text PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"weight_kg" numeric(5, 2),
	"steps" integer,
	"calories" integer,
	"sleep_hours" numeric(3, 1),
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "height_cm" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "birth_date" date;--> statement-breakpoint
ALTER TABLE "daily_log" ADD CONSTRAINT "daily_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;