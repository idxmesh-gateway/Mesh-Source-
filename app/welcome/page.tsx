import Link from 'next/link';

export const metadata = { title: 'Welcome — Mesh Source' };

export default function WelcomePage() {
  return (
    <main
      style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '60px 24px',
        fontFamily: 'var(--font-sans)',
        lineHeight: 1.7,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          letterSpacing: '0.15em',
          color: 'var(--cyan)',
          marginBottom: 24,
        }}
      >
        MESH//SOURCE
      </div>

      <h1 style={{ fontSize: 32, margin: '0 0 12px', fontWeight: 500, letterSpacing: '-0.02em' }}>
        We don&apos;t store your work. Ever.
      </h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: 40 }}>
        Read this once. It explains how the service works and why.
      </p>

      <Section title="How it works">
        Tell us the task. Answer a few quick questions. We deliver. You take the result with
        you.
      </Section>

      <Section title="What you pay">
        Every charge is the true compute cost of your request plus a fixed fee. No
        subscriptions, no markup games, no expiring credits.
      </Section>

      <Section title="What we keep">
        Your email, your balance, and the names of your projects. Nothing else. No chat
        history, no deliverables, no tracking.
      </Section>

      <Section title="What you must do">
        Save your deliverable before closing the tab. Use <b>Download</b> or <b>Email a copy</b>.
        Once the tab closes, the work is gone. There is no recovery. This is by design — it
        keeps costs low and passes the savings to you.
      </Section>

      <Section title="The minimum">
        $1 must sit in a project&apos;s budget before it can send a request. That covers the
        upfront reserve; anything unused comes off the balance afterward.
      </Section>

      <div style={{ marginTop: 48 }}>
        <Link href="/app" className="btn btn-primary" style={{ padding: '12px 24px' }}>
          I understand — go to the app
        </Link>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.15em',
          color: 'var(--cyan)',
          textTransform: 'uppercase',
          margin: '0 0 8px',
          fontWeight: 500,
        }}
      >
        {title}
      </h2>
      <p style={{ margin: 0, color: 'var(--text)' }}>{children}</p>
    </section>
  );
}
