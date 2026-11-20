'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function EmailForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="landing-email-sent">
        <div className="landing-email-sent-title">Check your inbox</div>
        <p className="landing-email-sent-sub">
          We sent a magic link to <b>{email}</b>. Open it on this device to continue.
        </p>
        <button
          className="landing-email-sent-reset"
          onClick={() => {
            setSent(false);
            setEmail('');
          }}
          type="button"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="landing-form">
      <input
        className="landing-input"
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        autoComplete="email"
      />
      <button className="landing-cta" type="submit" disabled={loading || !email.trim()}>
        {loading ? <span className="spinner" /> : null}
        Start building
        <span aria-hidden>→</span>
      </button>
      {error && <div className="landing-error">{error}</div>}
    </form>
  );
}
