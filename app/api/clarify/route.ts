import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deepseek, MODEL_NAME } from '@/lib/deepseek';

export const runtime = 'nodejs';
export const maxDuration = 30;

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
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content:
            'You generate clarifying questions for a task. Return ONLY a JSON array of 2 to 3 short question strings. No prose, no markdown fences, no explanation. Each question under 20 words. Ask about scope, format, or audience — whatever is most material to doing this well.',
        },
        { role: 'user', content: `Task: ${task}` },
      ],
    });
    const raw = completion.choices?.[0]?.message?.content ?? '[]';
    const cleaned = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    let questions: string[] = [];
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        questions = parsed.filter((x) => typeof x === 'string').slice(0, 3);
      }
    } catch {}
    if (questions.length === 0) {
      questions = ['What format should the output be in?', 'Who is the audience?'];
    }
    return NextResponse.json({ questions });
  } catch {
    return NextResponse.json({
      questions: ['What format should the output be in?', 'Who is the audience?'],
    });
  }
}
