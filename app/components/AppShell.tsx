'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { saveDraft, loadDraft, clearDraft } from '@/lib/draft';
import ProfileCard from './ProfileCard';
import RefillModal from './RefillModal';

type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  wallet_address: string | null;
  account_balance: number;
  bonus_balance: number;
};
type Project = { id: string; name: string; budget_balance: number; status: string };
type Msg = { role: 'user' | 'assistant'; content: string };
type Phase = 'idle' | 'clarifying' | 'ready' | 'solving' | 'done';

function stripContinue(s: string): string {
  const stripped = s.replace(/\s*\bCONTINUE\b[.!]?\s*$/i, '').trimEnd();
  return stripped.length > 0 ? stripped : s;
}

export default function AppShell({
  profile: initialProfile,
  initialProjects,
}: {
  profile: Profile;
  initialProjects: Project[];
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [projects, setProjects] = useState(initialProjects);
  const [activeId, setActiveId] = useState<string | null>(initialProjects[0]?.id ?? null);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [deliverable, setDeliverable] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [task, setTask] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [restoredAt, setRestoredAt] = useState<number | null>(null);
  const [needsContinue, setNeedsContinue] = useState(false);

  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [refillOpen, setRefillOpen] = useState(false);

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState('5');

  const active = projects.find((p) => p.id === activeId) ?? null;
  const convRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (convRef.current) convRef.current.scrollTop = convRef.current.scrollHeight;
  }, [messages, phase, questions, currentQ]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      setDeliverable('');
      setPhase('idle');
      setTask('');
      setQuestions([]);
      setAnswers([]);
      setCurrentQ(0);
      setRestoredAt(null);
      setNeedsContinue(false);
      return;
    }
    const draft = loadDraft(profile.id, activeId);
    if (!draft) {
      setMessages([]);
      setDeliverable('');
      setPhase('idle');
      setTask('');
      setQuestions([]);
      setAnswers([]);
      setCurrentQ(0);
      setRestoredAt(null);
      setNeedsContinue(false);
      return;
    }
    setMessages(draft.messages);
    setDeliverable(draft.deliverable);
    setTask(draft.task);
    setQuestions(draft.questions);
    setAnswers(draft.answers);
    setCurrentQ(draft.currentQ);
    setNeedsContinue(Boolean(draft.needsContinue));
    if (draft.phase === 'clarifying' || draft.phase === 'solving') {
      setPhase(draft.questions.length > 0 ? 'ready' : 'idle');
    } else {
      setPhase(draft.phase);
    }
    setRestoredAt(draft.savedAt);
    setToast(`Draft restored from ${new Date(draft.savedAt).toLocaleTimeString()}`);
  }, [activeId, profile.id]);

  useEffect(() => {
    if (!activeId) return;
    saveDraft(profile.id, activeId, {
      messages,
      deliverable,
      phase,
      task,
      questions,
      answers,
      currentQ,
      needsContinue,
      savedAt: Date.now(),
    });
  }, [
    activeId,
    profile.id,
    messages,
    deliverable,
    phase,
    task,
    questions,
    answers,
    currentQ,
    needsContinue,
  ]);

  async function refresh() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: p } = await supabase
      .from('profiles')
      .select('id, email, display_name, wallet_address, account_balance, bonus_balance')
      .eq('id', user.id)
      .single();
    if (p) {
      setProfile({
        id: p.id,
        email: p.email ?? '',
        display_name: p.display_name,
        wallet_address: p.wallet_address,
        account_balance: Number(p.account_balance),
        bonus_balance: Number(p.bonus_balance),
      });
    }
    const { data: ps } = await supabase
      .from('projects')
      .select('id, name, budget_balance, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (ps) {
      setProjects(
        ps.map((x) => ({ id: x.id, name: x.name, budget_balance: Number(x.budget_balance), status: x.status }))
      );
    }
  }

  async function createProject() {
    setError(null);
    const name = newName.trim() || 'Untitled';
    const budget = Number(newBudget);
    if (!Number.isFinite(budget) || budget < 1) {
      setError('Minimum $1 to fund a project');
      return;
    }
    setCreating(true);
    const res = await fetch('/api/project/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, budget }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setError(data.error ?? 'create_failed');
      return;
    }
    setProjects((prev) => [
      { id: data.id, name: data.name, budget_balance: Number(data.budget_balance), status: 'active' },
      ...prev,
    ]);
    setActiveId(data.id);
    setNewName('');
    setNewBudget('5');
    setRestoredAt(null);
    await refresh();
  }

  async function startTask() {
    const text = input.trim();
    if (!text || !active) return;
    setError(null);
    setInput('');
    setTask(text);
    setMessages([{ role: 'user', content: text }]);
    setPhase('clarifying');
    setQuestions([]);
    setAnswers([]);
    setCurrentQ(0);
    setDeliverable('');
    setNeedsContinue(false);
    setRestoredAt(null);

    const res = await fetch('/api/clarify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: text }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'clarify_failed');
      setPhase('idle');
      return;
    }

    const qs: string[] = data.questions ?? [];
    if (qs.length === 0) {
      await solve(text, [], []);
      return;
    }

    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(''));
    setPhase('ready');
  }

  async function answerCurrent(value: string) {
    const trimmed = value.trim();
    const next = [...answers];
    next[currentQ] = trimmed;
    setAnswers(next);
    setMessages((m) => [...m, { role: 'user', content: trimmed || '(skipped)' }]);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      await solve(task, questions, next);
    }
  }

  async function solve(taskArg: string, questionArr: string[], answerArr: string[]) {
    if (!activeId) return;
    setPhase('solving');
    const composed = [
      `Task: ${taskArg}`,
      '',
      ...questionArr.map((q, i) => `Q: ${q}\nA: ${answerArr[i] || '(skipped)'}`),
      '',
      'Produce the deliverable now. Be thorough and ready to use.',
    ].join('\n');

    const res = await fetch('/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: activeId, prompt: composed }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'solve_failed');
      setPhase('ready');
      return;
    }
    setDeliverable(stripContinue(data.content ?? ''));
    setNeedsContinue(Boolean(data.needs_continue));
    setMessages((m) => [...m, { role: 'assistant', content: 'Deliverable ready — see the right panel.' }]);
    setPhase('done');
    setToast(`Charged $${Number(data.charged).toFixed(6)}`);
    await refresh();
  }

  async function revise(instruction: string) {
    if (!activeId || !deliverable) return;
    setPhase('solving');
    const composed = [
      'Previous deliverable:',
      deliverable,
      '',
      `Revision request: ${instruction}`,
      '',
      'Return the full revised deliverable, not just the changed parts.',
    ].join('\n');

    const res = await fetch('/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: activeId, prompt: composed }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'solve_failed');
      setPhase('done');
      return;
    }
    setDeliverable(stripContinue(data.content ?? ''));
    setNeedsContinue(Boolean(data.needs_continue));
    setToast(`Charged $${Number(data.charged).toFixed(6)}`);
    setPhase('done');
    await refresh();
  }

  async function continueGeneration() {
    if (!activeId || !deliverable || !needsContinue) return;
    setPhase('solving');
    const composed = [
      `Original task: ${task}`,
      '',
      'Previous deliverable (this ended at a stop point):',
      deliverable,
      '',
      'Continue producing the deliverable from exactly where it stopped.',
      'Do not repeat any previous content.',
      'Do not start with a preamble like "Continuing..." — just resume from the exact stopping point.',
      'If you finish, end without the word CONTINUE.',
      'If you need to stop again, end with the literal word CONTINUE on its own line.',
    ].join('\n');

    const res = await fetch('/api/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: activeId, prompt: composed }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'solve_failed');
      setPhase('done');
      return;
    }

    const addition = stripContinue(data.content ?? '');
    setDeliverable(deliverable + '\n\n' + addition);
    setNeedsContinue(Boolean(data.needs_continue));
    setPhase('done');
    setToast(`Charged $${Number(data.charged).toFixed(6)}`);
    await refresh();
  }

  function downloadMd() {
    if (!deliverable) return;
    const blob = new Blob([deliverable], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mesh-source-${new Date().toISOString().slice(0, 10)}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function emailCopy() {
    if (!deliverable) return;
    const res = await fetch('/api/email-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: deliverable }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) setToast(`Sent to ${data.sent_to ?? profile.email}`);
    else setToast(`Email: ${data.error ?? 'failed'}`);
  }

  function startNewTask() {
    if (activeId) clearDraft(profile.id, activeId);
    setMessages([]);
    setDeliverable('');
    setPhase('idle');
    setTask('');
    setQuestions([]);
    setAnswers([]);
    setCurrentQ(0);
    setError(null);
    setRestoredAt(null);
    setNeedsContinue(false);
  }

  function estimateCostRange(): { lo: number; hi: number } {
    const answerChars = answers.join('').length;
    const totalChars = task.length + answerChars;
    const inputTokens = Math.ceil(totalChars / 4) + 500;
    const outputTokens = totalChars > 2000 ? 7000 : 4000;
    const cost = (inputTokens * 0.3 + outputTokens * 1.2) / 1_000_000;
    const charged = cost * 20;
    return { lo: charged * 0.5, hi: charged * 1.5 };
  }
  
  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          MESH<span>//</span>SOURCE
        </div>
        <div className="header-right">
          <div className="balance-chip">
            <b>${profile.account_balance.toFixed(4)}</b> USDC
          </div>
          <button className="icon-btn" onClick={() => setProfileOpen(true)} aria-label="Profile">
            {profile.email.slice(0, 2).toUpperCase()}
          </button>
        </div>
      </header>

      <div className="split">
        <section className="panel">
          <div className="panel-head">
            <span>
              Conversation
              {restoredAt && (
                <span
                  className="mono"
                  style={{ marginLeft: 10, fontSize: 10, color: 'var(--cyan)' }}
                >
                  · RESTORED
                </span>
              )}
            </span>
            {active && (
              <button className="btn btn-ghost btn-sm" onClick={startNewTask}>
                + New task
              </button>
            )}
          </div>

          {!active ? (
            <div className="empty-state">
              <h2>Start a project</h2>
              <p>Each project holds its own budget. Minimum $1 in the project to send a request.</p>
              <div style={{ width: '100%', maxWidth: 320 }}>
                <input
                  className="input"
                  placeholder="Project name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ marginBottom: 8 }}
                />
                <input
                  className="input"
                  placeholder="Initial budget (USD)"
                  type="number"
                  min="1"
                  step="0.01"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  style={{ marginBottom: 12 }}
                />
                <button
                  className="btn btn-primary"
                  onClick={createProject}
                  disabled={creating}
                  style={{ width: '100%' }}
                >
                  {creating ? <span className="spinner" /> : null}
                  Create &amp; fund
                </button>
                {error && <div className="err">{error}</div>}
              </div>
            </div>
          ) : (
            <>
              <div className="conversation" ref={convRef}>
                {messages.length === 0 && phase === 'idle' && (
                  <div className="empty-state">
                    <h2>What do you want to build?</h2>
                    <p>
                      Project: <b style={{ color: 'var(--cyan)' }}>{active.name}</b> · Budget $
                      {active.budget_balance.toFixed(2)}
                    </p>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div key={i} className={`msg ${m.role}`}>
                    {m.content}
                  </div>
                ))}

                {phase === 'clarifying' && (
                  <div className="msg assistant">
                    <span className="spinner" /> Reading your task…
                  </div>
                )}

                {phase === 'ready' && questions[currentQ] && (
                  <div className="question-card">
                    <div className="q-index">
                      QUESTION {currentQ + 1} / {questions.length}
                    </div>
                    <div className="q-text">{questions[currentQ]}</div>
                    <AnswerBox onSubmit={answerCurrent} />
                    {currentQ === questions.length - 1 && (
                      <div
                        className="mono"
                        style={{
                          marginTop: 10,
                          fontSize: 11,
                          color: 'var(--text-dimmer)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        Estimated deliverable cost: ~$
                        {estimateCostRange().lo.toFixed(3)}–${estimateCostRange().hi.toFixed(3)}
                      </div>
                    )}
                  </div>
                )}

                {phase === 'solving' && (
                  <div className="msg assistant">
                    <span className="spinner" /> Generating deliverable…
                  </div>
                )}
              </div>

              <div className="composer">
                <textarea
                  className="textarea"
                  placeholder={
                    phase === 'done'
                      ? 'Describe a revision, or start a new task.'
                      : 'Describe your task and desired outcome…'
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (phase === 'done' && deliverable && input.trim()) {
                        const ins = input.trim();
                        setInput('');
                        revise(ins);
                      } else {
                        startTask();
                      }
                    }
                  }}
                  rows={3}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (phase === 'done' && deliverable && input.trim()) {
                      const ins = input.trim();
                      setInput('');
                      revise(ins);
                    } else {
                      startTask();
                    }
                  }}
                  disabled={!input.trim() || phase === 'clarifying' || phase === 'solving'}
                >
                  {phase === 'done' ? 'Revise' : 'Send'}
                </button>
              </div>
              {error && <div className="err" style={{ padding: '0 20px 12px' }}>{error}</div>}
            </>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <span>Deliverable</span>
            {active && (
              <span className="mono" style={{ color: 'var(--cyan)', fontSize: 11 }}>
                ${active.budget_balance.toFixed(4)} left
              </span>
            )}
          </div>
          <div className="deliverable-wrap">
            {deliverable ? (
              <div className="deliverable">{deliverable}</div>
            ) : (
              <div className="empty-state" style={{ height: '100%' }}>
                <p style={{ color: 'var(--text-dimmer)' }}>
                  Your deliverable will appear here.
                  <br />
                  <span style={{ fontSize: 12 }}>
                    Drafts auto-save in this browser. Save to disk or email before closing.
                  </span>
                </p>
              </div>
            )}
          </div>
          {deliverable && (
            <div className="deliverable-actions">
              <button className="btn btn-primary btn-sm" onClick={downloadMd}>
                Download .md
              </button>
              <button className="btn btn-sm" onClick={emailCopy}>
                Email a copy
              </button>
              {needsContinue && (
                <button
                  className="btn btn-sm"
                  onClick={continueGeneration}
                  disabled={phase === 'solving'}
                  style={{
                    borderColor: 'var(--cyan)',
                    color: 'var(--cyan)',
                    marginLeft: 'auto',
                  }}
                >
                  {phase === 'solving' ? <span className="spinner" /> : null}
                  Continue generating
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {profileOpen && (
        <ProfileCard
          profile={profile}
          onClose={() => setProfileOpen(false)}
          onRefill={() => {
            setProfileOpen(false);
            setRefillOpen(true);
          }}
        />
      )}

      {refillOpen && (
        <RefillModal
          onClose={() => setRefillOpen(false)}
          onSuccess={async () => {
            setRefillOpen(false);
            setToast('Credits added');
            await refresh();
          }}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function AnswerBox({ onSubmit }: { onSubmit: (v: string) => void }) {
  const [v, setV] = useState('');
  return (
    <div>
      <input
        className="input"
        placeholder="Type your answer, or press Enter to skip"
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit(v);
            setV('');
          }
        }}
        autoFocus
      />
      <div style={{ marginTop: 8, textAlign: 'right' }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            onSubmit(v);
            setV('');
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
