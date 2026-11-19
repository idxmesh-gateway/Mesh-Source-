'use client';

import { useState } from 'react';

type Result = {
  content?: string;
  charged?: number;
  tokens?: { input: number; cached: number; output: number };
  error?: string;
  message?: string;
};

export default function TestPage() {
  const [projectId, setProjectId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setResult(null);
    setElapsed(null);
    const started = Date.now();
    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId.trim(), prompt: prompt.trim() }),
      });
      const data = (await res.json()) as Result;
      setResult(res.ok ? data : { error: data.error ?? 'request_failed', message: data.message });
    } catch (err) {
      setResult({ error: 'network_error', message: (err as Error)?.message });
    } finally {
      setElapsed(Date.now() - started);
      setLoading(false);
    }
  }

  const ok = result && !result.error;

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: 900, margin: '0 auto' }}>
      <h1>Solve test</h1>
      <p style={{ color: '#666', fontSize: 14 }}>
        Temporary harness. Delete when the real UI ships.
      </p>

      <form onSubmit={submit} style={{ marginTop: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Project ID</label>
        <input
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          style={{
            width: '100%',
            padding: '0.5rem',
            fontFamily: 'monospace',
            fontSize: 13,
            marginBottom: '1rem',
          }}
        />

        <label style={{ display: 'block', fontSize: 13, marginBottom: 4 }}>Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          placeholder="Write a 30-second documentary voiceover about the invention of the shipping container."
          style={{ width: '100%', padding: '0.5rem', fontSize: 14, marginBottom: '1rem' }}
        />

        <button
          type="submit"
          disabled={loading || !projectId.trim() || !prompt.trim()}
          style={{ padding: '0.6rem 1.4rem', fontSize: 14, cursor: loading ? 'wait' : 'pointer' }}
        >
          {loading ? 'Working…' : 'Send'}
        </button>
        {elapsed !== null && (
          <span style={{ marginLeft: 12, fontSize: 13, color: '#666' }}>{elapsed}ms</span>
        )}
      </form>

      {result?.error && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1rem',
            background: '#fee',
            border: '1px solid #fbb',
            borderRadius: 4,
            fontSize: 14,
          }}
        >
          <strong>Error:</strong> {result.error}
          {result.message && <div style={{ marginTop: 4, color: '#666' }}>{result.message}</div>}
        </div>
      )}

      {ok && (
        <>
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1rem',
              background: '#efe',
              border: '1px solid #bfb',
              borderRadius: 4,
              fontSize: 13,
              fontFamily: 'monospace',
            }}
          >
            <div>
              <strong>Charged:</strong> ${Number(result.charged).toFixed(6)}
            </div>
            <div>
              <strong>Tokens:</strong> in {result.tokens?.input} (cached{' '}
              {result.tokens?.cached}) out {result.tokens?.output}
            </div>
          </div>

          <pre
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#f6f6f6',
              border: '1px solid #ddd',
              borderRadius: 4,
              whiteSpace: 'pre-wrap',
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {result.content}
          </pre>
        </>
      )}
    </main>
  );
}
