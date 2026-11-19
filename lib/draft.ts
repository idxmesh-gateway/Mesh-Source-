'use client';

export type Draft = {
  messages: { role: 'user' | 'assistant'; content: string }[];
  deliverable: string;
  phase: 'idle' | 'clarifying' | 'ready' | 'solving' | 'done';
  task: string;
  questions: string[];
  answers: string[];
  currentQ: number;
  needsContinue?: boolean;
  savedAt: number;
};

const PREFIX = 'mesh:draft';

function key(userId: string, projectId: string) {
  return `${PREFIX}:${userId}:${projectId}`;
}

export function saveDraft(userId: string, projectId: string, draft: Draft): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = { ...draft, savedAt: Date.now() };
    window.localStorage.setItem(key(userId, projectId), JSON.stringify(payload));
  } catch {
    // Quota exceeded or private mode — fail silently, user keeps working in memory.
  }
}

export function loadDraft(userId: string, projectId: string): Draft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key(userId, projectId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (typeof parsed !== 'object' || !parsed || !Array.isArray(parsed.messages)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearDraft(userId: string, projectId: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key(userId, projectId));
  } catch {}
}

export function clearAllDrafts(userId: string): number {
  if (typeof window === 'undefined') return 0;
  const prefix = `${PREFIX}:${userId}:`;
  let cleared = 0;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    keys.forEach((k) => {
      window.localStorage.removeItem(k);
      cleared++;
    });
  } catch {}
  return cleared;
}

export function listDraftProjectIds(userId: string): string[] {
  if (typeof window === 'undefined') return [];
  const prefix = `${PREFIX}:${userId}:`;
  const ids: string[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(prefix)) ids.push(k.slice(prefix.length));
    }
  } catch {}
  return ids;
}
