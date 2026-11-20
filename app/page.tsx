import EmailForm from './components/EmailForm';

export const metadata = {
  title: 'Mesh Source — Enterprise-grade deliverables, for pennies',
  description:
    'Business plans, tested code, and executive documents. With the clarifying questions a senior consultant would ask. Pay per deliverable. No subscriptions.',
};

const CAPABILITIES = [
  {
    title: 'Business plans',
    desc: 'Market analysis, go-to-market, financial model, execution roadmap. What consultants charge $5,000 to write, for $0.10.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h12l4 4v12H4z" />
        <path d="M16 4v4h4" />
        <path d="M8 16l2-3 2 2 3-5" />
      </svg>
    ),
  },
  {
    title: 'Tested code',
    desc: 'Production-quality artifacts with error handling, edge cases, and self-tests. What a contractor charges $500 for a first pass, for $0.20.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
        <path d="M13 6l-2 12" />
      </svg>
    ),
  },
  {
    title: 'Websites & apps',
    desc: 'Full-stack scaffolds, landing pages, and interactive tools — deployed-ready, with setup instructions included.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18" />
        <circle cx="6.5" cy="7" r="0.5" fill="currentColor" />
        <circle cx="9" cy="7" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Product specs',
    desc: 'Prototypes, feature briefs, and technical documentation — with tradeoffs made explicit, not assumed.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3l8 4v10l-8 4-8-4V7z" />
        <path d="M12 12l8-5M12 12l-8-5M12 12v9" />
      </svg>
    ),
  },
  {
    title: 'Executive documents',
    desc: 'Proposals, memos, board decks, and case studies. Polished, structured, ready to send.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 3h11l4 4v14H5z" />
        <path d="M16 3v4h4" />
        <path d="M9 12h7M9 16h5" />
      </svg>
    ),
  },
  {
    title: 'Marketing campaigns',
    desc: 'Launch plans, ad copy, positioning, and brand voice — grounded in real market context.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 10v4a1 1 0 001 1h3l6 4V5L7 9H4a1 1 0 00-1 1z" />
        <path d="M17 9a4 4 0 010 6" />
      </svg>
    ),
  },
  {
    title: 'Career documents',
    desc: 'Resumes tuned to a specific role, cover letters, negotiation briefs, and interview prep.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
        <path d="M3 13h18" />
      </svg>
    ),
  },
  {
    title: 'Contracts & drafts',
    desc: 'SOWs, NDAs, terms of service — first drafts with the pitfalls called out. Lawyer review recommended.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 3h11l4 4v14H5z" />
        <path d="M16 3v4h4" />
        <path d="M9 13c1-1 2-1 2 0s-1 1-1 0c2-2 4 0 4 0" />
      </svg>
    ),
  },
  {
    title: 'Research briefs',
    desc: 'Competitive analysis, market intel, and decision memos — structured to make the call obvious.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="6" />
        <path d="M15 15l5 5" />
      </svg>
    ),
  },
  {
    title: 'Data structures',
    desc: 'Spreadsheet specs, database schemas, and API contracts — with the edge cases named.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
  },
];

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
          Pay per deliverable · No subscriptions · We don&apos;t store your work
        </div>

        <h1 className="landing-h1">
          ENTERPRISE-GRADE DELIVERABLES
          <br />
          <span className="landing-h1-for">for</span>
          <br />
          <span className="landing-h1-accent">PENNIES</span>
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
          <h2 className="landing-h2">Ten things. Delivered for pennies.</h2>
        </div>

        <div className="landing-grid">
          {CAPABILITIES.map((c) => (
            <article key={c.title} className="landing-card">
              <div className="landing-card-icon" aria-hidden>
                {c.icon}
              </div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </article>
          ))}
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
        <div className="landing-footer-tag">Better questions. Better work.</div>
      </footer>
    </main>
  );
}
