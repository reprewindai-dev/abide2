import { describe, it } from "node:test";
import assert from "node:assert";
import { assertDbConfiguredInProduction, isDatabaseConfigured } from "../db/client";

describe("Database client configuration", () => {
  it("reflects whether DATABASE_URL is present", () => {
    const previousUrl = process.env.DATABASE_URL;
    try {
      delete process.env.DATABASE_URL;
      assert.strictEqual(isDatabaseConfigured(), false);

      process.env.DATABASE_URL = "postgres://localhost/abide";
      assert.strictEqual(isDatabaseConfigured(), true);
    } finally {
      if (previousUrl === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = previousUrl;
    }
  });

  it("fails closed in production without DATABASE_URL", () => {
    const previousUrl = process.env.DATABASE_URL;
    const previousNodeEnv = process.env.NODE_ENV;
    try {
      delete process.env.DATABASE_URL;
      process.env.NODE_ENV = "production";
      assert.throws(
        () => assertDbConfiguredInProduction(),
        /DATABASE_URL is required in production/
      );

      process.env.DATABASE_URL = "postgres://localhost/abide";
      assert.doesNotThrow(() => assertDbConfiguredInProduction());
    } finally {
      if (previousUrl === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = previousUrl;
      if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it("does not require DATABASE_URL outside production", () => {
    const previousUrl = process.env.DATABASE_URL;
    const previousNodeEnv = process.env.NODE_ENV;
    try {
      delete process.env.DATABASE_URL;
      process.env.NODE_ENV = "test";
      assert.doesNotThrow(() => assertDbConfiguredInProduction());
    } finally {
      if (previousUrl === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = previousUrl;
      if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = previousNodeEnv;
    }
  });
});
