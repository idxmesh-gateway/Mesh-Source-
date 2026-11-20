import EmailForm from './components/EmailForm';

export const metadata = {
  title: 'Mesh Source — Enterprise-grade deliverables, for pennies',
  description:
    'Business plans, tested code, and executive documents. With the clarifying questions a senior consultant would ask. Pay per deliverable. No subscriptions.',
};

export default function LandingPage() {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">
          MESH<span>//</span>SOURCE
        </div>
        <a href="#start" className="landing-nav-cta">
          Start building
        </a>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-eyebrow">
          <span className="landing-dot" />
          Pay per deliverable · No subscription · No card to explore
        </div>

        <h1 className="landing-h1">
          Enterprise-grade deliverables.
          <br />
          <span className="landing-h1-accent">For pennies.</span>
        </h1>

        <p className="landing-sub">
          Business plans, tested code, and executive documents — with the clarifying
          questions a senior consultant would ask. Most cost under $1.
        </p>

        <div id="start" className="landing-form-wrap">
          <EmailForm />
          <div className="landing-trust">
            Magic link. No password. <span className="landing-trust-sep">·</span> No credit card required
          </div>
        </div>

        <div className="landing-hero-glow" aria-hidden />
      </section>

      <section className="landing-section">
        <div className="landing-section-head">
          <div className="landing-eyebrow">What we build</div>
          <h2 className="landing-h2">Real deliverables. Not chat replies.</h2>
        </div>

        <div className="landing-grid">
          <article className="landing-card">
            <div className="landing-card-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h12l4 4v12H4z" />
                <path d="M16 4v4h4" />
                <path d="M8 12h8M8 16h6" />
              </svg>
            </div>
            <h3>Full-scope business plans</h3>
            <p>
              Market analysis, go-to-market, financial model, and step-by-step execution.
              What a consultant charges $5,000 to write, for $0.10.
            </p>
          </article>

          <article className="landing-card">
            <div className="landing-card-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
              </svg>
            </div>
            <h3>Tested code</h3>
            <p>
              Production-quality artifacts with error handling, edge cases, and self-tests.
              What a contractor charges $500 for a first pass, for $0.20.
            </p>
          </article>

          <article className="landing-card">
            <div className="landing-card-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="6" width="18" height="13" rx="2" />
                <path d="M3 10h18M8 6V4h8v2" />
              </svg>
            </div>
            <h3>Executive documents</h3>
            <p>
              Proposals, memos, case studies, and briefs. Polished, structured, and ready
              to send to your board, your client, or your investor.
            </p>
          </article>

          <article className="landing-card">
            <div className="landing-card-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v4l3 2" />
              </svg>
            </div>
            <h3>Every deliverable includes instructions</h3>
            <p>
              Not just the document — the exact sequence to execute it. What a runbook
              would cost a week of someone&apos;s time to build.
            </p>
          </article>
        </div>
      </section>

      <section className="landing-section landing-moat">
        <div className="landing-section-head">
          <div className="landing-eyebrow">Why it&apos;s better</div>
          <h2 className="landing-h2">
            We ask better questions <span className="landing-h2-accent">first.</span>
          </h2>
          <p className="landing-moat-sub">
            Every task starts with 2–3 clarifying questions only someone who understood it
            would know to ask. That&apos;s why the deliverables read like a professional
            wrote them — because a professional asked first.
          </p>
        </div>

        <div className="landing-conversation">
          <div className="landing-bubble landing-bubble-user">
            <div className="landing-bubble-label">You</div>
            Write a product launch plan for a $199 mechanical keyboard aimed at programmers.
          </div>

          <div className="landing-bubble landing-bubble-ai">
            <div className="landing-bubble-label">
              <span className="landing-dot" /> Mesh Source
            </div>
            <p>
              Three things I need to get this right:
            </p>
            <ol className="landing-questions">
              <li>What&apos;s your launch budget, and is T0 fixed or open?</li>
              <li>Is this direct-to-consumer, Amazon FBA, or through a distributor?</li>
              <li>Do you have an existing brand identity, or do I recommend one?</li>
            </ol>
          </div>

          <div className="landing-bubble landing-bubble-user">
            <div className="landing-bubble-label">You</div>
            $30k, T0 open. Amazon FBA + Shopify. No brand yet — recommend one.
          </div>

          <div className="landing-bubble landing-bubble-deliver">
            <div className="landing-bubble-label landing-bubble-label-success">
              Deliverable ready · Charged $0.10
            </div>
            Complete plan — positioning, spec, budget, timeline, risk, KPIs. Ready to
            review.
          </div>
        </div>
      </section>

      <section className="landing-section landing-promise">
        <div className="landing-section-head">
          <div className="landing-eyebrow">The promise</div>
          <h2 className="landing-h2">Simple, honest, and cheap.</h2>
        </div>

        <div className="landing-promise-grid">
          <div className="landing-promise-item">
            <div className="landing-promise-num">01</div>
            <h3>No subscriptions</h3>
            <p>Pay only when you build. Most deliverables cost under $1.</p>
          </div>
          <div className="landing-promise-item">
            <div className="landing-promise-num">02</div>
            <h3>No data retention</h3>
            <p>
              Drafts live in your browser. We don&apos;t store your work. Save it to disk or
              email before you close the tab.
            </p>
          </div>
          <div className="landing-promise-item">
            <div className="landing-promise-num">03</div>
            <h3>1 credit = 1 dollar</h3>
            <p>Recharge with USDC on Solana. No expiry. No hidden markup.</p>
          </div>
        </div>
      </section>

      <section className="landing-final" id="start-bottom">
        <h2 className="landing-final-h2">
          What do you <span className="landing-h2-accent">actually</span> need built?
        </h2>
        <p className="landing-final-sub">
          Describe it. We&apos;ll ask the questions. You get the deliverable.
        </p>
        <div className="landing-form-wrap">
          <EmailForm />
        </div>
        <div className="landing-hero-glow landing-hero-glow-bottom" aria-hidden />
      </section>

      <footer className="landing-footer">
        <div className="landing-logo landing-logo-sm">
          MESH<span>//</span>SOURCE
        </div>
        <div className="landing-footer-tag">
          Better questions. Better work.
        </div>
      </footer>
    </main>
  );
}
