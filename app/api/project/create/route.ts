import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: { name?: string; budget?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }
  const name = (body.name ?? 'Untitled').toString().trim().slice(0, 80) || 'Untitled';
  const budget = Number(body.budget);
  if (!Number.isFinite(budget) || budget < 1) {
    return NextResponse.json({ error: 'min_budget_1' }, { status: 400 });
  }
  if (budget > 10000) {
    return NextResponse.json({ error: 'max_budget_10000' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: project, error: insErr } = await admin
    .from('projects')
    .insert({ user_id: user.id, name, status: 'active' })
    .select('id, name, budget_balance')
    .single();

  if (insErr || !project) {
    return NextResponse.json({ error: 'create_failed' }, { status: 500 });
  }

  const { error: fundErr } = await admin.rpc('fund_project', {
    p_user_id: user.id,
    p_project_id: project.id,
    p_amount: budget,
    p_reference: `create:${project.id}`,
  });

  if (fundErr) {
    await admin.from('projects').delete().eq('id', project.id);
    const msg = fundErr.message ?? '';
    if (msg.includes('insufficient_account_balance')) {
      return NextResponse.json(
        { error: 'insufficient_account_balance', message: 'Add credits to your account first.' },
        { status: 402 }
      );
    }
    return NextResponse.json({ error: 'fund_failed' }, { status: 500 });
  }

  const { data: fresh } = await admin
    .from('projects')
    .select('id, name, budget_balance')
    .eq('id', project.id)
    .single();

  return NextResponse.json({
    id: project.id,
    name: fresh?.name ?? name,
    budget_balance: Number(fresh?.budget_balance ?? budget),
  });
}
