const releaseUrl = "https://github.com/pasted-app/pasted/releases/latest";
const repoUrl = "https://github.com/pasted-app/pasted";

const clips = [
  { app: "Safari", icon: "↗", text: "getpasted.app", meta: "just now", tone: "blue" },
  { app: "Terminal", icon: ">_", text: "npm run tauri dev", meta: "2 min", tone: "mint" },
  { app: "Notes", icon: "Aa", text: "Everything you copy, ready when you need it.", meta: "8 min", tone: "amber" },
];

const features = [
  { icon: "⌘", title: "Forget me not", body: "Remember exactly what you forgot using the half-remembered bit still rattling around your head." },
  { icon: "▦", title: "A place for everything. Automatically.", body: "Put everything in its place without having to remember where that place is." },
  { icon: "✦", title: "Change is inevitable. Formatting is optional.", body: "Turn unruly text into clean Markdown, reshaped data, or something intelligence has had a word with." },
  { icon: "◫", title: "Take another shot", body: "Pasted keeps screenshots, PDFs, images, text, links, and files together. No hangover folder required." },
  { icon: "›_", title: "Speak softly. Carry a big CLI.", body: "The GUI points and clicks. The CLI pipes, scripts, and generally gets carried away." },
  { icon: "◎", title: "Home is where the database is", body: "Your core library lives on your machine. The cloud is where it doesn’t." },
];

const journey = [
  { number: "01", title: "Copy first. Ask questions later.", body: "Change nothing. Pasted catches text, links, images, files, and the strange fragments between them." },
  { number: "02", title: "Put everything in its place. Even if you don’t.", body: "Pin the critical bits. Drop clips into Bins. Let rules do the work you were definitely getting around to." },
  { number: "03", title: "Those who search, find. Eventually.", body: "We made eventually instant. Use search, the HUD, history, or the CLI and bring anything back ready to work." },
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
          <a href="#enemy">The enemy</a><a href="#journey">The plan</a><a href="#field-kit">Field kit</a><a href={repoUrl}>GitHub</a>
        </nav>
        <a className="header-download" href={releaseUrl}>Get Pasted <span>↓</span></a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">For humans, robots, scripts, and other copycats</p>
            <h1>You have better things<br/><em>to forget about.</em></h1>
            <p className="hero-lede">Copy it. Forget it. Find it later. That was always the plan. Computers just missed the last part.</p>
            <div className="hero-actions">
              <a className="button primary" href={releaseUrl}><span className="download-mark">↓</span><span>Get Pasted<small>macOS 13 or later</small></span></a>
              <a className="button secondary" href={repoUrl}>View on GitHub <span>↗</span></a>
            </div>
            <p className="hero-note">Free and open source. No cover charge.</p>
          </div>
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-specimens" aria-hidden="true">
            <span className="specimen specimen-a">COPY № 001</span>
            <span className="specimen specimen-b">PASTE № 001</span>
            <span className="specimen specimen-c">CLONE VERIFIED</span>
            <span className="specimen specimen-d">⌘C → ⌘V</span>
          </div>
          <ProductWindow />
        </section>

        <section className="trust-line" aria-label="Pasted qualities">
          <span>Copy and forget</span><i /> <span>Lose nothing</span><i /> <span>Find the unfindable</span><i /> <span>Copy responsibly</span>
        </section>

        <div className="replication-ribbon" aria-hidden="true">
          <div className="replication-track">
            <span>REPLICATION DEPARTMENT DEPARTMENT</span><i />
            <span>DOLLY HAS ENTERED THE CHAT 🐑</span><i />
            <span>AGENT SMITH WOULD LIKE TO PASTE</span><i />
            <span>MITOSIS COMPLETED SUCCESSFULLY</span><i />
            <span>XEROX MACHINE IS WARM</span><i />
            <span>CTRL+C HAS REPRODUCED</span><i />
            <span>REPLICATION DEPARTMENT DEPARTMENT</span><i />
            <span>DOLLY HAS ENTERED THE CHAT 🐑</span><i />
            <span>AGENT SMITH WOULD LIKE TO PASTE</span><i />
            <span>MITOSIS COMPLETED SUCCESSFULLY</span><i />
            <span>XEROX MACHINE IS WARM</span><i />
            <span>CTRL+C HAS REPRODUCED</span><i />
          </div>
        </div>

        <section className="enemy-section" id="enemy">
          <div className="chapter-mark"><span>01</span><p>The enemy has no memory</p></div>
          <div className="enemy-copy"><p className="kicker">Out of sight. Out of clipboard.</p><h2>Your standard clipboard forgets everything.<br/><em>One thing at a time.</em></h2><p>Copy something new and the previous thing is promoted to former thing. This is an astonishing design choice for a machine capable of simulating weather and rendering dragons.</p><p>You don’t need discipline. Just get Pasted.</p></div>
          <div className="amnesia-machine" aria-label="A sequence showing copied items disappearing">
            <div className="machine-top"><span>SYSTEM CLIPBOARD</span><small>CAPACITY: 1</small></div>
            <div className="memory alive"><b>03</b><span>That important thing</span><em>HELD FOR NOW</em></div>
            <div className="memory fading"><b>02</b><span>The useful link</span><em>OVERWRITTEN</em></div>
            <div className="memory gone"><b>01</b><span>The perfect sentence</span><em>GONE FOREVER</em></div>
            <div className="machine-warning">⚠ NEXT COPY WILL DESTROY ITEM 03</div>
          </div>
        </section>

        <section className="guide-section">
          <div className="chapter-mark"><span>02</span><p>Your spirit animal is a clipboard</p></div>
          <div className="guide-statement"><p className="kicker">What happens in the clipboard stays in Pasted</p><h2>Pasted keeps what<br/><em>your clipboard throws away.</em></h2><p>Pasted is the quiet accomplice between Copy and Paste. It catches what matters, gives it structure, and stays out of the way until you need it. No productivity doctrine. No mandatory cloud. No judgment about the thirty-seven tabs.</p></div>
          <aside className="field-note"><span>FIELD NOTE № 001</span><p>“If at first you don’t succeed, Command-C again. Pasted kept the first one.”</p><small>— The operating principle</small></aside>
        </section>

        <section className="story-section" aria-labelledby="supporting-cast">
          <div className="story-intro">
            <p className="kicker">A gripping character study</p>
            <h2 id="supporting-cast">Meet the supporting cast.<br/><em>They’re very attached.</em></h2>
            <p>Three ordinary office supplies. One extraordinary inability to let go.</p>
          </div>
          <div className="story-grid">
            <article className="story-card clip-story">
              <header><span>01</span><strong>Clip</strong><small>Short-term memory</small></header>
              <div className="story-stage" aria-hidden="true">
                <div className="clipboard-character"><i/><b>!</b></div>
                <div className="loose-thought">VERY IMPORTANT</div>
                <div className="catcher">PASTED</div>
              </div>
              <h3>Forgets everything. Immediately.</h3>
              <p>Clip means well. Clip can only hold one thought. Pasted follows behind with a net.</p>
            </article>
            <article className="story-card glue-story">
              <header><span>02</span><strong>Paste</strong><small>Attachment specialist</small></header>
              <div className="story-stage" aria-hidden="true">
                <div className="glue-bottle"><i/><b>PASTE</b></div>
                <span className="scrap scrap-a">URL</span><span className="scrap scrap-b">IDEA</span><span className="scrap scrap-c">CODE</span>
              </div>
              <h3>Has trouble letting go.</h3>
              <p>A serious boundary issue in an adhesive is actually excellent product design.</p>
            </article>
            <article className="story-card history-story">
              <header><span>03</span><strong>History</strong><small>Professional overthinker</small></header>
              <div className="story-stage" aria-hidden="true">
                <div className="history-reel"><i/></div>
                <div className="history-tape"><span>NOW</span><span>EARLIER</span><span>THAT THING</span></div>
              </div>
              <h3>Brings up everything from the past.</h3>
              <p>Usually exhausting. Surprisingly useful when the past contains your perfect sentence.</p>
            </article>
          </div>
        </section>

        <section className="journey-section" id="journey">
          <div className="chapter-mark"><span>03</span><p>Where we’re going we still need roads</p></div>
          <div className="section-intro"><p className="kicker">Same old copy. Brand new paste.</p><h2>You keep copying.<br/><em>We’ll stop forgetting.</em></h2></div>
          <div className="journey-grid">{journey.map(step => <article className="journey-card" data-step={step.number} key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.body}</p></article>)}</div>
        </section>

        <section className="feature-section" id="field-kit">
          <div className="chapter-mark"><span>04</span><p>Keep your pants on</p></div>
          <div className="section-intro"><p className="kicker">Go big or go Command-C</p><h2>Tiny toolbelt.<br/><em>Massive tool.</em></h2><p>Use one tool. Or all of them. Your clipboard has no idea what’s coming.</p></div>
          <div className="feature-grid">
            {features.map(feature => <article className="feature-card" key={feature.title}><span>{feature.icon}</span><h3>{feature.title}</h3><p>{feature.body}</p></article>)}
          </div>
        </section>

        <section className="split-section" id="privacy">
          <div className="split-copy"><p className="kicker">What happens on your computer stays on your computer</p><h2>There’s no place<br/><em>like ~/Library.</em></h2><p>Clipboard history can contain passwords, code, medical forms, terrible first drafts, and the address of the surprise party. Pasted keeps its core library local and makes every outside connection your decision.</p><ul><li><span>✓</span> Local SQLite library</li><li><span>✓</span> Optional AI connections</li><li><span>✓</span> Import, export, and reset controls</li></ul></div>
          <div className="privacy-card"><div className="privacy-orbit"><span className="lock">⌾</span><i className="orbit-one"/><i className="orbit-two"/></div><strong>Your business is none of ours.</strong><small>On your device, under your control.</small></div>
        </section>

        <section className="cli-section" id="cli">
          <div><p className="kicker">Speak softly and carry a big pipe</p><h2>Open the hatch.<br/><em>There’s a CLI underneath.</em></h2><p>Point and click until you’d rather pipe and script. The command line uses the same library and machinery as the app.</p></div>
          <div className="terminal"><div className="terminal-bar"><span className="traffic red"/><span className="traffic yellow"/><span className="traffic green"/><small>zsh</small></div><pre><span className="prompt">$</span> pasted copy "https://wordpress.org/download/"<br/><span className="dim">Saved.</span> The web can continue.<br/><br/><span className="prompt">$</span> pasted search "Framework screwdriver"<br/><span className="dim">Found.</span> The laptop you are allowed to open.<br/><br/><span className="prompt">$</span> pasted search "Vollebak Full Metal Jacket"<br/><span className="dim">Found.</span> Tuesday outfit. 11km of copper included. <span className="cursor">▋</span></pre></div>
        </section>

        <section className="prior-art-section">
          <div className="chapter-mark"><span>05</span><p>Prior art department</p></div>
          <div className="section-intro">
            <p className="kicker">Copying has been working since before computers</p>
            <h2>Nothing is original.<br/><em>We checked.</em></h2>
            <p>Cells divide. Sheep get cloned. Agents multiply. Office machines hum. Pasted simply gives your clipboard several billion years of overdue evolution.</p>
          </div>
          <div className="experiment-grid">
            <article className="experiment-card cell-experiment">
              <header><small>Specimen 01</small><span>Mitosis</span></header>
              <div className="experiment-visual" aria-hidden="true"><i className="mother-cell"><b/><b/></i></div>
              <h3>Two for the price of one cell.</h3>
              <p>Beta testing since approximately 3.8 billion years ago.</p>
            </article>
            <article className="experiment-card sheep-experiment">
              <header><small>Specimen 02</small><span>Dolly</span></header>
              <div className="experiment-visual sheep-line" aria-hidden="true"><i>🐑</i><i>🐑</i><i>🐑</i></div>
              <h3>Version control. But wool.</h3>
              <p>First successful commit: 1996. Merge request still pending.</p>
            </article>
            <article className="experiment-card smith-experiment">
              <header><small>Specimen 03</small><span>Agent Smith</span></header>
              <div className="experiment-visual smith-line" aria-hidden="true"><i>01</i><i>01</i><i>01</i><i>01</i><i>01</i></div>
              <h3>Infinite instances. One dress code.</h3>
              <p>Enterprise cloning with extremely proprietary sunglasses.</p>
            </article>
            <article className="experiment-card copier-experiment">
              <header><small>Specimen 04</small><span>Office copier</span></header>
              <div className="experiment-visual copier-stage" aria-hidden="true"><div className="copier"><i/><b/><span>READY</span></div></div>
              <h3>The original Command-C.</h3>
              <p>Paper jammed. Cyan depleted. Somehow still essential.</p>
            </article>
          </div>
        </section>

        <section className="resolution-section">
          <div className="chapter-mark"><span>06</span><p>Are you even reading any of this?</p></div>
          <p className="kicker">The future is already here. It just forgot what you copied.</p>
          <h2>Give your memory<br/><em>an API.</em></h2>
          <p>AI is becoming everything. Everything still needs context. A clipboard that remembers, organizes, transforms, and exposes its history is a very small piece of software with a very large future.</p>
        </section>

        <section className="final-cta">
          <div className="cell-colony" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} />)}</div>
          <img src="/pasted-mark.svg" alt=""/><h2>Get Pasted tonight.<br/><em>Remember everything tomorrow.</em></h2><p>Take all the shots you want. Pasted keeps the screenshots, the receipts, and the things you were definitely going to remember yourself.</p><a className="button primary" href={releaseUrl}>Get Pasted <span>↓</span></a>
        </section>
      </main>

      <footer><a className="brand footer-brand" href="#top"><span className="brand-mark"><img src="/pasted-mark.svg" alt="" /></span>Pasted</a><p>Made by Triple J Software, Inc. Copy responsibly.</p><div><a href={repoUrl}>GitHub</a><a href={`${repoUrl}/releases`}>Releases</a><a href={`${repoUrl}/issues`}>Feedback</a></div></footer>
    </div>
  );
}
