import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: check project budget >= $1
  // TODO: call DeepSeek
  // TODO: calculate cost, multiply by 20, deduct
  // TODO: return result

  return NextResponse.json({ status: 'not_implemented' }, { status: 501 });
}
