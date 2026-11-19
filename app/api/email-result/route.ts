import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: { content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }
  const content = (body.content ?? '').toString();
  if (!content) return NextResponse.json({ error: 'empty' }, { status: 400 });
  if (content.length > 200_000) return NextResponse.json({ error: 'too_large' }, { status: 413 });

  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) {
    return NextResponse.json(
      { error: 'email_not_configured', message: 'Set RESEND_API_KEY and RESEND_FROM in Vercel.' },
      { status: 501 }
    );
  }

  const html = `<pre style="font-family:ui-monospace,monospace;white-space:pre-wrap;font-size:13px;line-height:1.6">${escapeHtml(
    content
  )}</pre>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      from,
      to: user.email,
      subject: 'Your Mesh Source deliverable',
      html,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
  return NextResponse.json({ sent_to: user.email });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
