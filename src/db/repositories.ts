import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "./client";
import { abideBlueprints, abideCheckpoints } from "./schema";

const DATABASE_REQUIRED_ERROR = "CAPPO HALT - DATABASE_URL is required for strict persistence. JSON fallbacks are forbidden.";

export async function saveBlueprint(id: string, blueprint: any): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error(DATABASE_REQUIRED_ERROR);
  }

  try {
    await getDb().insert(abideBlueprints).values({
      id,
      blueprint,
      updatedAt: sql`NOW()`
    }).onConflictDoUpdate({
      target: abideBlueprints.id,
      set: {
        blueprint,
        updatedAt: sql`NOW()`
      }
    });
    console.log(`[DB Connector] Successfully persisted blueprint ${id} to PostgreSQL.`);
  } catch (err: any) {
    throw new Error(`[DB Connector] PostgreSQL save failed: ${err.message}`);
  }
}

export async function getBlueprint(id: string): Promise<any | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const rows = await getDb().select({ blueprint: abideBlueprints.blueprint })
      .from(abideBlueprints)
      .where(eq(abideBlueprints.id, id))
      .limit(1);
    return rows[0]?.blueprint || null;
  } catch (err: any) {
    console.error("[DB Connector] PostgreSQL fetch failed:", err.message);
    return null;
  }
}

export async function deleteBlueprint(id: string): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    const rows = await getDb().delete(abideBlueprints)
      .where(eq(abideBlueprints.id, id))
      .returning({ id: abideBlueprints.id });
    return rows.length > 0;
  } catch (err: any) {
    console.error("[DB Connector] PostgreSQL delete failed:", err.message);
    return false;
  }
}

export async function loadAllCheckpoints(): Promise<any[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const rows = await getDb().select()
      .from(abideCheckpoints)
      .orderBy(asc(abideCheckpoints.timestamp));
    return rows.map((row) => row.checkpoint);
  } catch (err: any) {
    console.error("[PG Checkpoint] Failed to load checkpoints:", err.message);
    return [];
  }
}

export async function saveCheckpoint(checkpoint: any): Promise<void> {
  await getDb().insert(abideCheckpoints).values({
    checkpointId: checkpoint.checkpointId,
    checkpoint,
    timestamp: sql`NOW()`
  });
}

export async function getCheckpointFromDatabase(checkpointId: string): Promise<any | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const rows = await getDb().select({ checkpoint: abideCheckpoints.checkpoint })
      .from(abideCheckpoints)
      .where(eq(abideCheckpoints.checkpointId, checkpointId))
      .limit(1);
    return rows[0]?.checkpoint || null;
  } catch (err: any) {
    console.error("[PG Checkpoint] Failed to get checkpoint:", err.message);
    return null;
  }
}
