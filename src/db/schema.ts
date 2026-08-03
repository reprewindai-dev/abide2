import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const abideBlueprints = pgTable("abide_blueprints", {
  id: text("id").primaryKey(),
  blueprint: jsonb("blueprint").notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const abideCheckpoints = pgTable("abide_checkpoints", {
  checkpointId: text("checkpointid").primaryKey(),
  checkpoint: jsonb("checkpoint").notNull(),
  timestamp: timestamp("timestamp").defaultNow()
});

export type AbideBlueprint = typeof abideBlueprints.$inferSelect;
export type NewAbideBlueprint = typeof abideBlueprints.$inferInsert;
export type AbideCheckpoint = typeof abideCheckpoints.$inferSelect;
export type NewAbideCheckpoint = typeof abideCheckpoints.$inferInsert;
