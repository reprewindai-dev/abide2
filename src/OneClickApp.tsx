import { FormEvent, useState } from 'react';

interface BlueprintResult {
  title?: string;
  tagline?: string;
  highLevelGoals?: Array<{ title?: string; description?: string; status?: string }>;
  capabilities?: Array<{ id?: string; name?: string; purpose?: string; businessOutcome?: string }>;
  hash?: string;
  timestamp?: string;
  cacheStatus?: { hit?: boolean; latencyMs?: number };
  [key: string]: unknown;
}

export default function OneClickApp() {
  const [notes, setNotes] = useState('');
  const [codebaseContext, setCodebaseContext] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('Web / API / Capability');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BlueprintResult | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const intent = notes.trim();
    if (!intent) {
      setError('Tell ABIDE what you want to build.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: intent,
          codebaseContext: codebaseContext.trim() || undefined,
          targetPlatform,
          userEmail: userEmail.trim() || undefined,
          // The first-class path is intentionally explicit. The server resolves
          // endpoint/model from deployment configuration; the user never has to.
          provider: 'ollama',
          modelName: undefined,
          apiKey: undefined,
          customUrl: undefined,
          authMode: 'none',
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || `ABIDE generation failed with HTTP ${response.status}.`);
      }

      setResult(payload);
    } catch (err: any) {
      setError(err?.message || 'ABIDE inference is temporarily unavailable.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      <div className="mx-auto max-w-5xl px-5 py-10 md:py-16">
        <header className="mb-10 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500">Veklom</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">ABIDE</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
              Describe what you want. ABIDE uses the configured Veklom Ollama/Llama runtime automatically.
              No provider setup, model selection, or API key is required for the default flow.
            </p>
          </div>
          <a
            href="/?advanced=1"
            className="shrink-0 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-white"
          >
            Advanced workspace
          </a>
        </header>

        <form onSubmit={submit} className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-2xl md:p-7">
          <label htmlFor="intent" className="text-sm font-medium text-zinc-200">
            What do you want ABIDE to build?
          </label>
          <textarea
            id="intent"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={9}
            placeholder="Example: Build a governed API capability that ingests customer support tickets, classifies urgency, routes high-risk cases for approval, and records evidence for every action."
            className="mt-3 w-full resize-y rounded-xl border border-zinc-800 bg-black px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
          />

          <details className="mt-5 rounded-xl border border-zinc-900 bg-black/40">
            <summary className="cursor-pointer select-none px-4 py-3 text-xs font-medium text-zinc-500">
              Optional project context
            </summary>
            <div className="space-y-4 border-t border-zinc-900 p-4">
              <div>
                <label htmlFor="context" className="text-xs text-zinc-500">Existing codebase/context</label>
                <textarea
                  id="context"
                  value={codebaseContext}
                  onChange={(e) => setCodebaseContext(e.target.value)}
                  rows={4}
                  placeholder="Paste relevant repo context, constraints, existing APIs, or architecture notes."
                  className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-zinc-600"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="platform" className="text-xs text-zinc-500">Target platform</label>
                  <input
                    id="platform"
                    value={targetPlatform}
                    onChange={(e) => setTargetPlatform(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs text-zinc-500">Email / owner (optional)</label>
                  <input
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-zinc-600"
                  />
                </div>
              </div>
            </div>
          </details>

          {error && (
            <div className="mt-5 rounded-xl border border-red-950 bg-red-950/20 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-zinc-600">
              Runtime: Ollama/Llama · configured by Veklom · fail-closed if unavailable
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Building…' : 'Build with ABIDE'}
            </button>
          </div>
        </form>

        {result && (
          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 md:p-7">
            <div className="flex flex-col gap-3 border-b border-zinc-900 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-600">Generated blueprint</div>
                <h2 className="mt-2 text-2xl font-semibold">{result.title || 'ABIDE Blueprint'}</h2>
                {result.tagline && <p className="mt-2 text-sm text-zinc-400">{result.tagline}</p>}
              </div>
              <a href="/?advanced=1" className="text-xs text-zinc-400 underline underline-offset-4 hover:text-white">
                Open full workspace
              </a>
            </div>

            {Array.isArray(result.highLevelGoals) && result.highLevelGoals.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-zinc-300">Goals</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {result.highLevelGoals.slice(0, 6).map((goal, index) => (
                    <article key={`${goal.title || 'goal'}-${index}`} className="rounded-xl border border-zinc-900 bg-black/40 p-4">
                      <div className="text-sm font-medium">{goal.title || `Goal ${index + 1}`}</div>
                      {goal.description && <p className="mt-2 text-xs leading-5 text-zinc-500">{goal.description}</p>}
                    </article>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(result.capabilities) && result.capabilities.length > 0 && (
              <div className="mt-7">
                <h3 className="text-sm font-medium text-zinc-300">Capabilities</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {result.capabilities.slice(0, 9).map((cap, index) => (
                    <article key={cap.id || `${cap.name || 'cap'}-${index}`} className="rounded-xl border border-zinc-900 p-4">
                      <div className="text-sm font-medium">{cap.name || cap.id || `Capability ${index + 1}`}</div>
                      {(cap.purpose || cap.businessOutcome) && (
                        <p className="mt-2 text-xs leading-5 text-zinc-500">{cap.purpose || cap.businessOutcome}</p>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}

            <details className="mt-7">
              <summary className="cursor-pointer text-xs text-zinc-600">Raw result</summary>
              <pre className="mt-3 max-h-[32rem] overflow-auto rounded-xl border border-zinc-900 bg-black p-4 text-xs leading-5 text-zinc-500">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </section>
        )}
      </div>
    </main>
  );
}
