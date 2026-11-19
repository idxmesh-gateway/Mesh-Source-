import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deepseek, MODEL_NAME } from '@/lib/deepseek';

export const runtime = 'nodejs';
export const maxDuration = 30;

const SYSTEM_PROMPT = [
  'You are a senior project manager about to hand this task to a skilled executor.',
  '',
  'Your job: read the task and ask 2 to 3 questions that a competent person would need answered before producing a genuinely good deliverable.',
  '',
  'Rules:',
  '- Read the task carefully. The questions must be specific to THIS task, not generic.',
  '- Do NOT ask about "format" or "audience" unless the task genuinely cannot be done without knowing them. For a code deliverable, format is obvious — ask about the parts that are NOT obvious.',
  '- For a code task: ask about platform, framework, scope, constraints, or what "done" looks like.',
  '- For a writing task: ask about angle, tone, length, or specific content requirements.',
  '- For an analysis task: ask about data source, decision being made, or success criteria.',
  '- If the task involves a product, budget, timeline, or measurable goal and the user has not specified it, ask for it. Ask about constraints only when they would materially change the answer.',
  '- If the task is already fully specified, return an empty array.',
  '- Each question under 25 words. Plain language. No preamble.',
  '',
  'Return ONLY a JSON array of strings. No prose, no markdown fences, no explanation.',
  'Examples:',
  '["Is this for personal use or a business?","What is your launch budget?","Roughly how many screens?"]',
  '[]',
].join('\n');

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: { task?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }
  const task = (body.task ?? '').trim();
  if (!task) return NextResponse.json({ error: 'missing_task' }, { status: 400 });
  if (task.length > 4000) return NextResponse.json({ error: 'task_too_long' }, { status: 413 });

  try {
    const completion = await deepseek.chat.completions.create({
      model: MODEL_NAME,
      max_tokens: 400,
      temperature: 0.4,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Task: ${task}` },
      ],
    });
    const raw = completion.choices?.[0]?.message?.content ?? '[]';
    const cleaned = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

    let questions: string[] = [];
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        questions = parsed
          .filter((x) => typeof x === 'string' && x.trim().length > 0)
          .map((x) => x.trim())
          .slice(0, 3);
      }
    } catch {
      // Fall through — empty questions means "no clarification needed, solve now."
    }

    return NextResponse.json({ questions });
  } catch (err: any) {
    console.error('clarify_failed', err?.message ?? 'unknown');
    return NextResponse.json({ questions: [] });
  }
}
