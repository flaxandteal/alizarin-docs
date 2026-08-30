import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="az-landing">
      <section className="az-hero">
        <div className="az-hero-mottle az-hero-mottle-1" aria-hidden />
        <div className="az-hero-mottle az-hero-mottle-2" aria-hidden />
        <div className="az-disc" aria-hidden />

        <div className="az-hero-content">
          <div className="az-wordmark az-display">alizarin</div>
          <div className="az-lockup">
            <span className="az-bar" aria-hidden />
            <span className="az-tagline az-display">fast JS knowledge graphs</span>
          </div>

          <h1 className="az-subhead az-display">
            Fast, expressive knowledge graphs for JS and TS
          </h1>

          <div className="az-cta">
            <Link className="az-btn az-btn-primary" href="/docs/quickstart">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M13 2 4 14h6l-1 8 9-12h-6Z" /></svg>
              Get started
            </Link>
            <Link className="az-btn az-btn-secondary" href="/docs">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3Zm18 0h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7Z" /></svg>
              View documentation
            </Link>
          </div>
        </div>

        <div className="az-ann az-ann-1 az-hand" aria-hidden>
          Relationships grow organically. Discover structure in complexity.
          <div className="rule" />
        </div>

        <div className="az-ann az-ann-2 az-hand" aria-hidden>
          <span>Structure emerges from nature.</span>
          <svg width="72" height="26" viewBox="0 0 72 26" fill="none" stroke="var(--az-ink-hand)" strokeWidth="1" style={{ flex: 'none', marginTop: '12px' }}>
            <path d="M1 4c22 0 44 6 64 14" />
            <path d="M58 20l7 0-2-6" />
          </svg>
        </div>

        <div className="az-features">
          <div className="az-feature">
            <svg width="27" height="27" viewBox="0 0 24 24" fill="var(--az-red)" stroke="var(--az-red)" strokeWidth="1.4" strokeLinejoin="round" style={{ flex: 'none', marginTop: '1px' }} aria-hidden><path d="M13 2 4 14h6l-1 8 9-12h-6Z" /></svg>
            <div>
              <h3>Blazing fast</h3>
              <p>Tiles load on demand and cache, so large models stay responsive.</p>
            </div>
          </div>
          <div className="az-feature">
            <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="var(--az-red)" strokeWidth="2.1" strokeLinecap="round" style={{ flex: 'none', marginTop: '1px' }} aria-hidden><circle cx="12" cy="5" r="2.4" fill="var(--az-red)" /><circle cx="5" cy="18" r="2.4" fill="var(--az-red)" /><circle cx="19" cy="18" r="2.4" fill="var(--az-red)" /><path d="M11 7.5 6.6 15.6M13 7.5l4.4 8.1M7.6 18h8.8" /></svg>
            <div>
              <h3>Rich knowledge graphs</h3>
              <p>Capture relationships across your data with a flexible graph model.</p>
            </div>
          </div>
          <div className="az-feature">
            <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="var(--az-red)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: '1px' }} aria-hidden><path d="m8.5 7.5-4.5 4.5 4.5 4.5M15.5 7.5 20 12l-4.5 4.5" /></svg>
            <div>
              <h3>Built for JS &amp; TS</h3>
              <p>Full type definitions, generated schemas, multilingual values.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="az-bindings">
        <div className="az-bindings-head">
          <h2>Bindings</h2>
          <div className="az-install">
            <span className="prompt">$</span>
            <span style={{ whiteSpace: 'nowrap' }}>npm install alizarin</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.6 }} aria-hidden><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5h10" /></svg>
          </div>
        </div>
        <div className="az-bind-grid">
          <Link className="az-bind-card" href="/docs/bindings/javascript">
            <div className="title">JavaScript / TypeScript</div>
            <div className="desc">The reference implementation.</div>
          </Link>
          <Link className="az-bind-card" href="/docs/bindings/napi">
            <div className="title">Node.js native (NAPI)</div>
            <div className="desc">Native speed on the server.</div>
          </Link>
          <Link className="az-bind-card" href="/docs/bindings/python">
            <div className="title">Python</div>
            <div className="desc">Alongside AORM pipelines.</div>
          </Link>
          <Link className="az-bind-card" href="/docs/bindings/rust">
            <div className="title">Rust</div>
            <div className="desc">The core, unwrapped.</div>
          </Link>
        </div>
      </section>

      <footer className="az-footer">
        <div>
          <div className="az-footer-brand">
            <span className="dot" />Alizarin
          </div>
          <p className="az-footer-blurb">
            A pure JS/TS implementation of AORM, built and maintained by Flax &amp; Teal Limited, Belfast.
          </p>
          <p className="az-footer-license">AGPL-3.0 — derived works must publish their source.</p>
        </div>
        <div className="az-footer-col">
          <div className="heading">Docs</div>
          <Link href="/docs/quickstart">Quickstart</Link>
          <Link href="/docs/installation">Installation</Link>
          <Link href="/docs/architecture">Architecture</Link>
          <Link href="/docs/api">API reference</Link>
        </div>
        <div className="az-footer-col">
          <div className="heading">Guides</div>
          <Link href="/docs/graphs">Graphs</Link>
          <Link href="/docs/mutations">Graph mutations</Link>
          <Link href="/docs/prebuild">Prebuild</Link>
          <Link href="/docs/llm-reference">LLM reference</Link>
        </div>
        <div className="az-footer-col">
          <div className="heading">Project</div>
          <a href="https://github.com/flaxandteal/alizarin">GitHub</a>
          <a href="https://archesproject.org">Arches project</a>
          <a href="https://flaxandteal.co.uk">Flax &amp; Teal</a>
        </div>
      </footer>
    </main>
  );
}
