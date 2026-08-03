import crypto from "crypto";
import { CheckpointSchema } from "./validation";
import {
  getCheckpointFromDatabase,
  loadAllCheckpoints as loadAllCheckpointsFromDatabase,
  saveCheckpoint as saveCheckpointToDatabase
} from "../db/repositories";

export interface Checkpoint {
  checkpointId: string;
  parentCheckpointId?: string | null;
  blueprintHash: string;
  packetHash: string;
  repositoryCommitSha: string;
  modifiedFiles: string[];
  testResults: Record<string, any>;
  unresolvedWork: string;
  agentIdentity: string;
  timestamp: string;
}

export async function loadAllCheckpoints(): Promise<Checkpoint[]> {
  return loadAllCheckpointsFromDatabase() as Promise<Checkpoint[]>;
}

export async function createCheckpoint(input: Omit<Checkpoint, "checkpointId" | "timestamp">): Promise<Checkpoint> {
  const checkpointId = "chk-" + crypto.randomBytes(8).toString("hex");
  const timestamp = new Date().toISOString();
  
  const checkpoint: Checkpoint = {
    checkpointId,
    timestamp,
    ...input
  };

  const parsed = CheckpointSchema.safeParse(checkpoint);
  if (!parsed.success) {
    throw new Error(`Checkpoint validation failed: ${parsed.error.issues.map(e => e.path.join(".") + ": " + e.message).join(", ")}`);
  }

  if (process.env.DATABASE_URL) {
    try {
      await saveCheckpointToDatabase(checkpoint);
    } catch (err: any) {
      console.error("[PG Checkpoint] Failed to save checkpoint:", err.message);
    }
  } else {
    throw new Error("CAPPO HALT - DATABASE_URL is required for checkpoint persistence.");
  }

  return checkpoint;
}

export async function getCheckpoint(checkpointId: string): Promise<Checkpoint | null> {
  return getCheckpointFromDatabase(checkpointId) as Promise<Checkpoint | null>;
}
