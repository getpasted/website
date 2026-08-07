const releaseUrl = "https://github.com/pasted-app/pasted/releases/latest";
const repoUrl = "https://github.com/pasted-app/pasted";

const clips = [
  { app: "Safari", icon: "↗", text: "getpasted.app", meta: "just now", tone: "blue" },
  { app: "Terminal", icon: ">_", text: "npm run tauri dev", meta: "2 min", tone: "mint" },
  { app: "Notes", icon: "Aa", text: "Everything you copy, ready when you need it.", meta: "8 min", tone: "amber" },
];

const features = [
  { icon: "⌘", title: "Instant recall", body: "Find anything you copied by text, source app, type, or smart attribute." },
  { icon: "✦", title: "Transforms", body: "Clean, format, and reshape clipboard content with repeatable workflows or AI." },
  { icon: "▦", title: "Bins that think", body: "Organize clips manually, or let Smart Bins collect matching content automatically." },
  { icon: "›_", title: "A real CLI", body: "Automate clipboard workflows from your shell with the same engine as the app." },
  { icon: "◫", title: "Files included", body: "Keep file references, rich previews, PDFs, screenshots, text, links, and images together." },
  { icon: "◎", title: "Local by default", body: "Your clipboard library stays on your device. Connections remain entirely optional." },
];

function ProductWindow() {
  return (
    <div className="product-window" aria-label="Preview of the Pasted app">
      <div className="window-bar">
        <span className="traffic red" /><span className="traffic yellow" /><span className="traffic green" />
        <span className="window-title">Pasted</span>
      </div>
      <div className="product-grid">
        <aside className="app-sidebar">
          <p className="eyebrow">Clips</p>
          <div className="nav-item active"><span>▣</span> History <b>248</b></div>
          <div className="nav-item"><span>≣</span> Queue</div>
          <div className="nav-item pin"><span>⌖</span> Pinned <b>4</b></div>
          <div className="nav-item protect"><span>♢</span> Protected</div>
          <p className="eyebrow bins">Bins</p>
          <div className="nav-item"><span>💬</span> Canned Replies</div>
          <div className="nav-item"><span>💻</span> Code Snippets <b>12</b></div>
          <div className="nav-item"><span>🔗</span> Links &amp; Web</div>
        </aside>
        <section className="clip-list">
          <div className="list-head"><strong>HISTORY</strong><span>◫ &nbsp; ◎</span></div>
          <div className="clip-stack">
            {clips.map((clip, index) => (
              <article className={`clip-card ${index === 0 ? "selected" : ""}`} key={clip.app}>
                <span className={`clip-icon ${clip.tone}`}>{clip.icon}</span>
                <div><strong>{clip.app}</strong><p>{clip.text}</p></div>
                <time>{clip.meta}</time>
              </article>
            ))}
          </div>
        </section>
        <section className="clip-preview">
          <div className="preview-head"><span className="type-pill">Text</span><strong>Safari</strong><span className="preview-actions">⌘ &nbsp; ◫ &nbsp; ♡</span></div>
          <div className="preview-body">
            <div className="preview-label">CLIP CONTENT</div>
            <p>getpasted.app</p>
            <div className="note"><span>✦</span><div><strong>Ready for later.</strong><small>Saved automatically from Safari</small></div></div>
          </div>
          <div className="preview-meta"><span>CHARS<br/><b>13</b></span><span>WORDS<br/><b>1</b></span><span>CAPTURED<br/><b>Just now</b></span></div>
        </section>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Pasted home"><span className="brand-mark"><img src="/pasted-mark.svg" alt="" /></span>Pasted</a>
        <nav aria-label="Primary navigation">
          <a href="#features">Features</a><a href="#privacy">Privacy</a><a href="#cli">CLI</a><a href={repoUrl}>GitHub</a>
        </nav>
        <a className="header-download" href={releaseUrl}>Download <span>↓</span></a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker"><span>✦</span> Clipboard history, without the clutter</p>
            <h1>Everything you copy.<br/><em>Ready when you need it.</em></h1>
            <p className="hero-lede">Pasted quietly remembers your clipboard, organizes the useful bits, and gives them back instantly.</p>
            <div className="hero-actions">
              <a className="button primary" href={releaseUrl}><span className="download-mark">↓</span><span>Download Pasted<small>macOS 13 or later</small></span></a>
              <a className="button secondary" href={repoUrl}>View on GitHub <span>↗</span></a>
            </div>
            <p className="hero-note">Free and open source · Linux preview available</p>
          </div>
          <div className="hero-glow" aria-hidden="true" />
          <ProductWindow />
        </section>

        <section className="trust-line" aria-label="Pasted qualities">
          <span>Private by default</span><i /> <span>Native and fast</span><i /> <span>Built for macOS &amp; Linux</span><i /> <span>Open source</span>
        </section>

        <section className="feature-section" id="features">
          <div className="section-intro"><p className="kicker">More than history</p><h2>Your clipboard becomes<br/><em>a working library.</em></h2><p>Pasted keeps the speed of copy and paste, then adds just enough structure to make it genuinely useful.</p></div>
          <div className="feature-grid">
            {features.map(feature => <article className="feature-card" key={feature.title}><span>{feature.icon}</span><h3>{feature.title}</h3><p>{feature.body}</p></article>)}
          </div>
        </section>

        <section className="split-section" id="privacy">
          <div className="split-copy"><p className="kicker">Yours means yours</p><h2>Private first.<br/><em>Powerful on purpose.</em></h2><p>Your clipboard can contain passwords, code, documents, and half-finished thoughts. Pasted keeps its core library local and makes every outside connection explicit.</p><ul><li><span>✓</span> Local SQLite library</li><li><span>✓</span> Optional AI connections</li><li><span>✓</span> Import, export, and reset controls</li></ul></div>
          <div className="privacy-card"><div className="privacy-orbit"><span className="lock">⌾</span><i className="orbit-one"/><i className="orbit-two"/></div><strong>Your library stays here.</strong><small>On your device, under your control.</small></div>
        </section>

        <section className="cli-section" id="cli">
          <div><p className="kicker">GUI meets shell</p><h2>Clipboard power,<br/><em>scriptable.</em></h2><p>The bundled CLI uses the same data and behaviors as the app, so your automations and your interface stay in sync.</p></div>
          <div className="terminal"><div className="terminal-bar"><span className="traffic red"/><span className="traffic yellow"/><span className="traffic green"/><small>zsh</small></div><pre><span className="prompt">$</span> pasted list --limit 3<br/><span className="dim">248</span>  getpasted.app<br/><span className="dim">247</span>  npm run tauri dev<br/><span className="dim">246</span>  Everything you copy...<br/><br/><span className="prompt">$</span> pasted search "release" <span className="cursor">▋</span></pre></div>
        </section>

        <section className="final-cta"><img src="/pasted-mark.svg" alt=""/><h2>Copy freely.<br/><em>Pasted remembers.</em></h2><p>Take control of the clipboard you already use all day.</p><a className="button primary" href={releaseUrl}>Download Pasted <span>↓</span></a></section>
      </main>

      <footer><a className="brand footer-brand" href="#top"><span className="brand-mark"><img src="/pasted-mark.svg" alt="" /></span>Pasted</a><p>Made by JJJ Software.</p><div><a href={repoUrl}>GitHub</a><a href={`${repoUrl}/releases`}>Releases</a><a href={`${repoUrl}/issues`}>Feedback</a></div></footer>
    </div>
  );
}
