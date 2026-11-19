import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  if (error) {
    console.error('auth_callback_error', error, error_description);
    return NextResponse.redirect(new URL('/login?error=auth', request.url));
  }

  const supabase = await createClient();

  if (code) {
    const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeErr) {
      return NextResponse.redirect(new URL('/welcome', request.url));
    }
    console.error('exchange_code_failed', exchangeErr.message);
  }

  if (token_hash && type) {
    const { error: otpErr } = await supabase.auth.verifyOtp({
      type: type as 'email',
      token_hash,
    });
    if (!otpErr) {
      return NextResponse.redirect(new URL('/welcome', request.url));
    }
    console.error('verify_otp_failed', otpErr.message);
  }

  return NextResponse.redirect(new URL('/login?error=auth', request.url));
}
