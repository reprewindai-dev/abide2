/**
 * Lightweight test setup preloaded for unit tests.
 * When RUN_INTEGRATION_TESTS !== '1', this file installs a safe global.fetch
 * shim that only proxies requests to localhost to the real runtime fetch and
 * returns deterministic mocks for external endpoints to avoid flaky network
 * calls during unit test runs.
 */
const originalFetch = (globalThis as any).fetch;

function makeJsonResponse(obj: any, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => obj,
    text: async () => JSON.stringify(obj)
  } as any;
}

if (process.env.RUN_INTEGRATION_TESTS !== '1') {
  (globalThis as any).fetch = async (input: any, init?: any) => {
    const url = typeof input === 'string' ? input : input?.url;
    // Allow localhost requests to reach real server started by tests
    if (typeof url === 'string' && (url.includes('localhost') || url.includes('127.0.0.1'))) {
      if (originalFetch) return originalFetch(input, init);
      throw new Error('No original fetch available to call localhost endpoint');
    }

    // Deterministic mock responses for common external endpoints used in tests
    if (typeof url === 'string' && url.includes('/api/verify')) {
      return makeJsonResponse({ satisfiable: true, model: {}, valid: true }, 200);
    }

    if (typeof url === 'string' && url.includes('/api/health')) {
      return makeJsonResponse({ status: 'healthy', service: 'mock-service', timestamp: new Date().toISOString() }, 200);
    }

    if (typeof url === 'string' && url.includes('/v1/health')) {
      return makeJsonResponse({ status: 'healthy', service: 'Veklom Sovereign AI Hub', timestamp: new Date().toISOString() }, 200);
    }

    if (typeof url === 'string' && url.includes('/v1/exec')) {
      return makeJsonResponse({ error: 'Unauthorized' }, 401);
    }

    if (typeof url === 'string' && url.includes('/api/verify/z3')) {
      return makeJsonResponse({ satisfiable: true, model: {} }, 200);
    }

    // Default mock for other external calls
    return makeJsonResponse({}, 200);
  };
}

export {};
