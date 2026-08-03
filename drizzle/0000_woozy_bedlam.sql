CREATE TABLE IF NOT EXISTS "abide_blueprints" (
	"id" text PRIMARY KEY NOT NULL,
	"blueprint" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "abide_checkpoints" (
	"checkpointid" text PRIMARY KEY NOT NULL,
	"checkpoint" jsonb NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
