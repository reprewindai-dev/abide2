export function mockTenantIdTla(): string {
  return "tenant-tla-test";
}

export function mockTenantIdEnterprise(): string {
  return "tenant-enterprise-99";
}

export function makePristineToken(overrides: Record<string, any> = {}) {
  const now = new Date();
  const token: any = {
    issuer: "CAPPO_AUTHORIZER_MAIN",
    tenantId: "tenant-999",
    planId: "3b235378-0cf7-4fbe-9014-996ff4207901",
    canonicalHash: "ae24f5a6b0c2d3e4f5a6b0c2d3e4f5a6b0c2d3e4f5a6b0c2d3e4f5a6b0c2d3e4",
    stepId: "f92b7cfa-4687-43cf-be44-fa3046124cb1",
    allowedCapability: "Sovereign Settlement Layer",
    allowedRepositories: ["https://github.com/abide/sovereign"],
    allowedFiles: ["src/scheduler/einstein.rs", "src/scheduler/telemetry.rs"],
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 3600000).toISOString(),
    nonce: "xyz-777",
    signature: "",
    ...overrides
  };
  return token;
}

export function makeExpiredToken(overrides: Record<string, any> = {}) {
  const now = new Date();
  const token: any = {
    issuer: "CAPPO_AUTHORIZER_MAIN",
    tenantId: "tenant-999",
    planId: "3b235378-0cf7-4fbe-9014-996ff4207901",
    canonicalHash: "ae24f5a6b0c2d3e4f5a6b0c2d3e4f5a6b0c2d3e4f5a6b0c2d3e4f5a6b0c2d3e4",
    stepId: "f92b7cfa-4687-43cf-be44-fa3046124cb1",
    allowedCapability: "Sovereign Settlement Layer",
    allowedRepositories: ["https://github.com/abide/sovereign"],
    allowedFiles: ["src/scheduler/einstein.rs", "src/scheduler/telemetry.rs"],
    issuedAt: new Date(now.getTime() - 7200000).toISOString(),
    expiresAt: new Date(now.getTime() - 3600000).toISOString(),
    nonce: "expired-999",
    signature: "",
    ...overrides
  };
  return token;
}

export function makeMockToken(overrides: Record<string, any> = {}) {
  return {
    allowedFiles: ["src/scheduler/einstein.rs", "src/scheduler/telemetry.rs"],
    ...overrides
  };
}

export function makeMockResult(stepId: string, overrides: Record<string, any> = {}) {
  return {
    stepId,
    sequence: 1,
    capability: "mock-capability",
    status: "SUCCESS",
    output: { settled: true },
    executedAt: new Date().toISOString(),
    resultHash: "",
    ...overrides
  };
}
