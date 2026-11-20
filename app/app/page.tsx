import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/app/components/AppShell';

export default async function AppPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const { data: profileRow } = await supabase
    .from('profiles')
    .select('id, email, display_name, wallet_address, account_balance, bonus_balance')
    .eq('id', user.id)
    .maybeSingle();

  if (!profileRow) {
    return (
      <main style={{ padding: 40, fontFamily: 'system-ui' }}>
        <h1>Profile not found</h1>
        <p>Try logging out and back in.</p>
      </main>
    );
  }

  const { data: projectRows } = await supabase
    .from('projects')
    .select('id, name, budget_balance, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (
    <AppShell
      profile={{
        id: profileRow.id,
        email: profileRow.email ?? '',
        display_name: profileRow.display_name,
        wallet_address: profileRow.wallet_address,
        account_balance: Number(profileRow.account_balance),
        bonus_balance: Number(profileRow.bonus_balance),
      }}
      initialProjects={(projectRows ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        budget_balance: Number(p.budget_balance),
        status: p.status,
      }))}
    />
  );
}
