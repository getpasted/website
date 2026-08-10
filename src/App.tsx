import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const repoUrl = "https://github.com/getpasted/pasted";
const releasesUrl = `${repoUrl}/releases`;
const brewCommand = "brew install --cask getpasted/tap/pasted";

type DemoClip = { app: string; icon: string; text: string; meta: string; tone: string };

type ReleaseAsset = { name: string; browser_download_url: string };
type PublicRelease = {
  name: string | null;
  tag_name: string;
  html_url: string;
  prerelease: boolean;
  draft: boolean;
  assets: ReleaseAsset[];
};

const clips: DemoClip[] = [
  { app: "Safari", icon: "↗", text: "getpasted.app", meta: "just now", tone: "blue" },
  { app: "Terminal", icon: ">_", text: "npm run tauri dev", meta: "2 min", tone: "mint" },
  { app: "Notes", icon: "Aa", text: "Everything you copy, ready when you need it.", meta: "8 min", tone: "amber" },
];

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    window.dispatchEvent(new CustomEvent("pasted-copy", { detail: text }));
  } catch {
    window.dispatchEvent(new CustomEvent("pasted-copy", { detail: "Clipboard permission declined. Very on-brand." }));
  }
};

const features = [
  { kind: "history", icon: "⌘", title: "History", body: "Remember exactly what you forgot using the half-remembered bit still rattling around your head." },
  { kind: "bins", icon: "▦", title: "Bins", body: "Put everything in its place without having to remember where that place is." },
  { kind: "transforms", icon: "✦", title: "Transforms", body: "Turn unruly text into clean Markdown, reshaped data, or something intelligence has had a word with." },
  { kind: "files", icon: "◫", title: "File Types", body: "Keep screenshots, PDFs, images, text, links, and files together. No hangover folder required." },
  { kind: "cli", icon: "›_", title: "CLI", body: "The GUI points and clicks. The CLI pipes, scripts, and generally gets carried away." },
  { kind: "sqlite", icon: "◎", title: "SQLite", body: "Your core library lives on your machine. The cloud is where it doesn’t." },
];

const replicationMessages = [
  "REPLICATION DEPARTMENT DEPARTMENT",
  "DOLLY HAS ENTERED THE CHAT 🐑",
  "AGENT SMITH WOULD LIKE TO PASTE",
  "MITOSIS COMPLETED SUCCESSFULLY",
  "XEROX MACHINE IS WARM",
  "CTRL+C HAS REPRODUCED",
];

function FeaturePreview({ kind }: { kind: string }) {
  if (kind === "history") return <div className="feature-preview preview-history" aria-hidden="true"><i>09:41</i><b>That perfect sentence</b><i>09:38</i><span>The link from earlier</span></div>;
  if (kind === "bins") return <div className="feature-preview preview-bins" aria-hidden="true"><span>🌭 Manual</span><span>💬 Replies</span><span>🔗 Links</span></div>;
  if (kind === "transforms") return <div className="feature-preview preview-transforms" aria-hidden="true"><code>messy text</code><i>✦</i><code>**clean text**</code></div>;
  if (kind === "files") return <div className="feature-preview preview-files" aria-hidden="true"><span>PDF</span><span>IMG</span><span>TXT</span><span>URL</span></div>;
  if (kind === "cli") return <div className="feature-preview preview-cli" aria-hidden="true"><code><b>$</b> pasted search "that thing"</code><small>Found. Obviously.</small></div>;
  return <div className="feature-preview preview-sqlite" aria-hidden="true"><span>clips</span><span>bins</span><span>revisions</span><i>LOCAL</i></div>;
}

const journey = [
  { number: "01", title: ["Copy first.", "Ask questions last."], body: "Change nothing. Pasted catches text, links, images, files, and the strange fragments between them." },
  { number: "02", title: ["There’s no place like", "wherever you decide."], body: "Pin the critical bits. Drop clips into Bins. Let rules do the work you were definitely getting around to." },
  { number: "03", title: ["Search around.", "Find out."], body: "We made eventually instant. Use search, the HUD, history, or the CLI and bring anything back ready to work." },
];

function ProductWindow() {
  const [visibleClips, setVisibleClips] = useState(1);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleClips(current => current >= clips.length ? 1 : current + 1);
      setSelected(0);
    }, 3200);
    return () => window.clearInterval(interval);
  }, []);

  const shownClips = clips.slice(0, visibleClips).reverse();
  const activeClip = shownClips[selected] ?? shownClips[0];

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
            {shownClips.map((clip, index) => (
              <button type="button" className={`clip-card ${index === selected ? "selected" : ""}`} key={`${visibleClips}-${clip.app}`} onClick={() => setSelected(index)}>
                <span className={`clip-icon ${clip.tone}`}>{clip.icon}</span>
                <div><strong>{clip.app}</strong><p>{clip.text}</p></div>
                <time>{clip.meta}</time>
              </button>
            ))}
          </div>
        </section>
        <section className="clip-preview">
          <div className="preview-head"><span className="type-pill">Text</span><strong>{activeClip.app}</strong><span className="preview-actions">⌘ &nbsp; ◫ &nbsp; ♡</span></div>
          <div className="preview-body">
            <div className="preview-label">CLIP CONTENT</div>
            <p>{activeClip.text}</p>
            <div className="note"><span>✦</span><div><strong>Ready for later.</strong><small>Saved automatically from {activeClip.app}</small></div></div>
          </div>
          <div className="preview-meta"><span>CHARS<br/><b>{activeClip.text.length}</b></span><span>WORDS<br/><b>{activeClip.text.split(/\s+/).length}</b></span><span>CAPTURED<br/><b>{activeClip.meta}</b></span></div>
        </section>
      </div>
      <div className="capture-signal" aria-live="polite"><span>+</span> Captured without making a scene</div>
    </div>
  );
}

const demoSnippets = [
  "The password is definitely not password.",
  "https://getpasted.app/#the-part-i-will-forget",
  "A suspiciously perfect sentence I will need on Thursday.",
];

function ClipboardCrimeScene() {
  const [systemClipboard, setSystemClipboard] = useState<Array<{ id: number; text: string }>>([]);
  const [pastedHistory, setPastedHistory] = useState<Array<{ text: string; copies: number }>>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const evidenceId = useRef(0);
  const crimeQueue = useRef(Promise.resolve());
  const copiedReset = useRef<number | undefined>(undefined);

  const commitCrime = (snippet: string, index: number) => {
    crimeQueue.current = crimeQueue.current.then(async () => {
      await copyText(snippet);
      setSystemClipboard(current => [{ id: evidenceId.current++, text: snippet }, ...current.filter(item => item.text !== snippet)].slice(0, 3));
      setPastedHistory(current => {
        const previous = current.find(item => item.text === snippet);
        return [{ text: snippet, copies: (previous?.copies ?? 0) + 1 }, ...current.filter(item => item.text !== snippet)];
      });
      setCopiedIndex(index);
      if (copiedReset.current !== undefined) window.clearTimeout(copiedReset.current);
      copiedReset.current = window.setTimeout(() => setCopiedIndex(null), 900);
    });
  };

  return (
    <section className="clipboard-lab" aria-labelledby="clipboard-lab-title">
      <div className="chapter-mark"><span>01½</span><p>Recreate the crime</p></div>
      <div className="lab-intro">
        <p className="kicker">Many clips are harmed during this demonstration</p>
        <h2 id="clipboard-lab-title">Copy three things.<br/><em>Keep all the evidence.</em></h2>
        <p>Try the buttons. Your standard clipboard develops selective amnesia. Pasted develops a case file.</p>
      </div>
      <div className="lab-grid">
        <div className="copy-deck">
          {demoSnippets.map((snippet, index) => (
            <button type="button" className={copiedIndex === index ? "just-copied" : ""} onClick={() => commitCrime(snippet, index)} key={snippet}>
              <span>0{index + 1}</span><code>{snippet}</code><b>{copiedIndex === index ? "COPIED" : "COPY"}</b>
            </button>
          ))}
        </div>
        <div className="clipboard-results">
          <article className="standard-result">
            <header><span>STANDARD CLIPBOARD</span><b>CAPACITY: 1</b></header>
            {systemClipboard.length === 0 ? <p className="empty-evidence">Waiting to forget something.</p> : <div className="evidence-stack">{systemClipboard.map((item, index) => (
              <div className="evidence-slot" style={{ "--evidence-index": index } as CSSProperties} key={item.id}><div className={`evidence ${index > 0 ? "destroyed" : ""}`}><span>{index === 0 ? "HELD" : "FORGOTTEN TEXT"}</span><p>{item.text}</p></div></div>
            ))}</div>}
            {systemClipboard.length > 1 && <small className="dead-scrolls">THE DEAD ⌘C SCROLLS</small>}
          </article>
          <article className="pasted-result">
            <header><span>PASTED</span><b>{pastedHistory.length} REMEMBERED</b></header>
            {pastedHistory.length === 0 ? <p className="empty-evidence">Suspiciously ready.</p> : <div className="evidence-stack">{pastedHistory.map((item, index) => (
              <div className="evidence-slot" style={{ "--evidence-index": index } as CSSProperties} key={item.text}><div className="evidence retained"><span>0{pastedHistory.length - index}</span><b className="copy-count">×{item.copies}</b><p>{item.text}</p></div></div>
            ))}</div>}
          </article>
        </div>
      </div>
    </section>
  );
}

function FeedbackTerminal() {
  const [kind, setKind] = useState("idea");
  const [message, setMessage] = useState("");
  const labels: Record<string, string> = {
    bug: "Something escaped containment",
    idea: "A clipboard-related revelation",
    love: "Suspiciously positive feedback",
    emergency: "Existential clipboard emergency",
  };
  const issueUrl = `${repoUrl}/issues/new?title=${encodeURIComponent(`[${kind}] ${message.slice(0, 72) || labels[kind]}`)}&body=${encodeURIComponent(`${message || "Tell us everything. We are good at listening."}\n\n— Sent from getpasted.app`)}`;

  return (
    <section className="feedback-section" id="listening">
      <div className="feedback-copy"><p className="kicker">Good at listening</p><h2>Tell us what happened.<br/><em>We’ll remember this time.</em></h2><p>No support maze. This opens a transparent GitHub issue with your message already attached.</p></div>
      <div className="feedback-terminal">
        <div className="feedback-kinds" role="group" aria-label="Feedback type">
          {Object.entries(labels).map(([value, label]) => <button type="button" className={kind === value ? "active" : ""} onClick={() => setKind(value)} key={value}>{label}</button>)}
        </div>
        <label htmlFor="feedback-message">TRANSMISSION</label>
        <textarea id="feedback-message" value={message} onChange={event => setMessage(event.target.value)} placeholder="The clipboard did a thing..." />
        <a className="button primary" href={issueUrl}>Open a GitHub issue <span>↗</span></a>
      </div>
    </section>
  );
}

function ReleaseVault() {
  const [release, setRelease] = useState<PublicRelease | null | false>(null);
  const [tapReady, setTapReady] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState<"macos" | "linux" | "windows" | "other">("other");

  useEffect(() => {
    const identity = `${navigator.platform} ${navigator.userAgent}`.toLowerCase();
    setPlatform(identity.includes("mac") ? "macos" : identity.includes("linux") ? "linux" : identity.includes("win") ? "windows" : "other");
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.github.com/repos/getpasted/pasted/releases?per_page=10", {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    })
      .then(response => response.ok ? response.json() as Promise<PublicRelease[]> : Promise.reject())
      .then(releases => setRelease(releases.find(item => !item.draft) ?? false))
      .catch(error => {
        if (error?.name !== "AbortError") setRelease(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.github.com/repos/getpasted/homebrew-tap/contents/Casks/pasted.rb", {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    })
      .then(response => setTapReady(response.ok))
      .catch(error => {
        if (error?.name !== "AbortError") setTapReady(false);
      });
    return () => controller.abort();
  }, []);

  const copyBrewCommand = async () => {
    await navigator.clipboard.writeText(brewCommand);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const homebrew = (
    <aside className={`homebrew-card ${tapReady ? "homebrew-ready" : ""}`}>
      <div className="brew-heading">
        <span className="brew-icon">⌂</span>
        <div><small>HOMEBREW</small><strong>{tapReady ? "Pour irresponsibly." : "Tap online. Keg pending."}</strong></div>
        <i>{tapReady === null ? "CHECKING" : tapReady ? "READY" : "AT 1.0"}</i>
      </div>
      <div className="brew-command" aria-label={`Homebrew command: ${brewCommand}`}>
        <code><span>$</span> {brewCommand}</code>
        <button type="button" onClick={copyBrewCommand} aria-label="Copy Homebrew install command">{copied ? "COPIED" : "COPY"}</button>
      </div>
      <p>{tapReady ? "The same signed app. Homebrew just does the dragging." : "This command wakes up with the first stable public release. The tap is already waiting."}</p>
    </aside>
  );

  if (release) {
    const macOS = release.assets.find(asset => asset.name.endsWith("_universal.dmg"));
    const linux = release.assets.find(asset => asset.name.endsWith("_amd64.AppImage"));
    const version = release.tag_name.replace(/^v/, "");
    const primaryAsset = platform === "linux" ? linux : macOS;
    const secondaryAsset = platform === "linux" ? macOS : linux;
    const primaryLabel = platform === "linux" ? "Linux" : "macOS";
    const secondaryLabel = platform === "linux" ? "macOS" : "Linux";
    return (
      <div className="release-stack">
      <aside className="release-vault release-ready">
        <div className="vault-label"><span>PUBLIC RELEASE</span><i>{release.prerelease ? "RELEASE CANDIDATE" : "READY"}</i></div>
        <img src="/pasted-mark.svg" alt="" />
        <h3>{release.name || `Pasted ${version}`}</h3>
        <p>Freshly bottled, publicly inspectable, and accompanied by cryptographic receipts.</p>
        {platform === "windows" ? <a className="button primary windows-wait" href={release.html_url}>Windows is sobering up <span>…</span></a> : <div className="release-buttons">
          {primaryAsset && <a className="button primary" href={primaryAsset.browser_download_url}>Download for {primaryLabel} <span>↓</span></a>}
          {secondaryAsset && <a className="button secondary" href={secondaryAsset.browser_download_url}>{secondaryLabel} <span>↓</span></a>}
        </div>}
        <a className="release-details" href={release.html_url}>Release notes, checksums, and other paperwork <span>↗</span></a>
      </aside>
      {homebrew}
      </div>
    );
  }

  return (
    <div className="release-stack">
    <aside className="release-vault">
      <div className="vault-label"><span>PUBLIC RELEASES</span><i>{release === null ? "CHECKING" : "SOON™"}</i></div>
      <img src="/pasted-mark.svg" alt="" />
      <h3>The first public batch is still being bottled.</h3>
      <p>The signed macOS build and Linux AppImage are going through their final irresponsible copying exercises.</p>
      <a className="button primary" href={releasesUrl}>Watch GitHub Releases <span>↗</span></a>
      <small>No email funnel. No fake countdown. No release we cannot prove exists.</small>
    </aside>
    {homebrew}
    </div>
  );
}

export default function App() {
  const [trail, setTrail] = useState<Array<{ id: number; text: string }>>([{ id: 0, text: "You arrived." }]);
  const [toast, setToast] = useState("");
  const [irresponsible, setIrresponsible] = useState(false);
  const trailRef = useRef<HTMLElement>(null);
  const trailEntryId = useRef(1);

  useEffect(() => {
    const leftScenes = document.querySelectorAll<HTMLElement>(
      ".enemy-copy,.guide-statement,.split-copy,.cli-section>div:first-child,.release-copy",
    );
    const rightScenes = document.querySelectorAll<HTMLElement>(
      ".amnesia-machine,.field-note,.privacy-card,.terminal,.release-section>div:last-child",
    );
    const upwardScenes = document.querySelectorAll<HTMLElement>(
      ".feature-section>.chapter-mark,.feature-card,.story-intro>*:not(.kicker),.story-card,.journey-section>.chapter-mark,.journey-card,.prior-art-section>.chapter-mark,.prior-art-section>.section-intro,.experiment-card,.resolution-section>.chapter-mark,.resolution-section>h2,.resolution-section>p,.clipboard-lab>.chapter-mark,.lab-intro,.copy-deck,.clipboard-results,.feedback-copy,.feedback-terminal,.final-cta>img,.final-cta>h2,.final-cta>p,.final-cta>.button",
    );
    const scenes = [...leftScenes, ...rightScenes, ...upwardScenes];

    leftScenes.forEach(scene => scene.classList.add("scroll-reveal", "reveal-left"));
    rightScenes.forEach(scene => {
      scene.classList.add("scroll-reveal", "reveal-right");
      scene.style.setProperty("--reveal-delay", "90ms");
    });
    upwardScenes.forEach((scene, index) => {
      scene.classList.add("scroll-reveal", "reveal-up");
      scene.style.setProperty("--reveal-delay", `${(index % 4) * 75}ms`);
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle("is-visible", entry.isIntersecting));
    }, { threshold: 0.16, rootMargin: "0px 0px -7%" });

    scenes.forEach(scene => observer.observe(scene));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncVisibility = () => document.body.classList.toggle("page-hidden", document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    const sections = [
      ["enemy", "The clipboard forgot."], ["clipboard-lab", "Evidence retained."], ["journey", "A plan appeared."],
      ["field-kit", "Toolbelt acquired."], ["privacy", "Business remained yours."], ["cli", "Hatch opened."],
      ["download", "Release located."], ["listening", "Someone listened."],
    ] as const;
    const observers = sections.map(([id, label]) => {
      const target = document.getElementById(id);
      if (!target) return null;
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) setTrail(current => current.some(item => item.text === label) ? current : [{ id: trailEntryId.current++, text: label }, ...current].slice(0, 6));
      }, { threshold: .22 });
      observer.observe(target);
      return observer;
    });
    return () => observers.forEach(observer => observer?.disconnect());
  }, []);

  useEffect(() => {
    let typed = "";
    const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let konamiIndex = 0;
    const activate = () => {
      setIrresponsible(value => !value);
      setToast("Irresponsible mode toggled. Legal has been notified.");
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      typed = `${typed}${event.key.toLowerCase()}`.slice(-5);
      if (typed === "paste") activate();
      konamiIndex = event.key === konami[konamiIndex] ? konamiIndex + 1 : 0;
      if (konamiIndex === konami.length) { konamiIndex = 0; activate(); }
    };
    const onCopy = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setToast(detail === "Clipboard permission declined. Very on-brand." ? detail : "Pasted noticed. Excellent form.");
      if (detail && !detail.includes("declined")) setTrail(current => [{ id: trailEntryId.current++, text: detail.replace(/\s+/g, " ").trim() }, ...current].slice(0, 6));
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pasted-copy", onCopy);
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("pasted-copy", onCopy); };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("irresponsible-mode", irresponsible);
    return () => document.body.classList.remove("irresponsible-mode");
  }, [irresponsible]);

  useEffect(() => {
    let frame = 0;
    const stopBeforeFooter = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const footer = document.querySelector("footer");
        const trailElement = trailRef.current;
        if (!footer || !trailElement) return;
        const overlap = Math.max(0, window.innerHeight - footer.getBoundingClientRect().top + 18);
        trailElement.style.setProperty("--trail-footer-offset", `${-overlap}px`);
      });
    };
    stopBeforeFooter();
    window.addEventListener("scroll", stopBeforeFooter, { passive: true });
    window.addEventListener("resize", stopBeforeFooter);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", stopBeforeFooter);
      window.removeEventListener("resize", stopBeforeFooter);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <div className="site-shell" onCopy={() => {
      const selection = window.getSelection()?.toString();
      if (selection) window.dispatchEvent(new CustomEvent("pasted-copy", { detail: selection }));
    }}>
      <aside ref={trailRef} className="memory-trail" aria-label="Your journey through the page"><strong>CLIPBOARD TRAIL</strong>{trail.map((item, index) => <span key={item.id}><i>0{index + 1}</i><em title={item.text}>{item.text}</em></span>)}</aside>
      <div className={`site-toast ${toast ? "visible" : ""}`} role="status">{toast}</div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Pasted home"><span className="brand-mark"><img src="/pasted-mark.svg" alt="" /></span>Pasted</a>
        <nav aria-label="Primary navigation">
          <a href="#enemy">The enemy</a><a href="#journey">The plan</a><a href="#field-kit">Field kit</a><a href={repoUrl}>GitHub</a>
        </nav>
        <a className="header-download" href="#download">Get Pasted <span>↓</span></a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">For humans, robots, scripts, and other copycats</p>
            <h1>You have better things<br/><em>to forget about.</em></h1>
            <p className="hero-lede">Copy it. Forget it. Find it later. That was always the plan. Computers just missed the last part.</p>
            <div className="hero-actions">
              <a className="button primary" href="#download"><span className="download-mark">↓</span><span>Get Pasted<small>macOS 13+ and Linux</small></span></a>
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
          <span>Copy and forget</span><i /> <span>Lose nothing</span><i /> <span>Find the unfindable</span><i /> <span>Copy irresponsibly</span>
        </section>

        <div className="replication-ribbon" aria-hidden="true">
          <div className="replication-track">
            {[0, 1].map(copy => (
              <div className="replication-set" key={copy}>
                {replicationMessages.map(message => <span key={message}>{message}<i /></span>)}
              </div>
            ))}
          </div>
        </div>

        <section className="enemy-section" id="enemy">
          <div className="chapter-mark"><span>01</span><p>The enemy has no memory</p></div>
          <div className="enemy-copy"><p className="kicker">Out of sight. Out of clipboard.</p><h2>Your standard clipboard forgets everything.<br/><em>One thing at a time.</em></h2><p>Copy something new and the previous thing is promoted to former thing. This is an astonishing design choice for a machine capable of simulating weather and rendering dragons.</p><p>I’m sorry. I forgot why I came in here.</p></div>
          <div className="amnesia-machine" aria-label="A sequence showing copied items disappearing">
            <div className="machine-top"><span>SYSTEM CLIPBOARD</span><small>CAPACITY: 1</small></div>
            <div className="memory alive"><b>03</b><span>That important thing</span><em>HELD FOR NOW</em></div>
            <div className="memory fading"><b>02</b><span>The useful link</span><em>OVERWRITTEN</em></div>
            <div className="memory gone"><b>01</b><span>The perfect sentence</span><em>GONE FOREVER</em></div>
            <div className="machine-warning">⚠ NEXT COPY WILL DESTROY ITEM 03</div>
          </div>
        </section>

        <ClipboardCrimeScene />

        <section className="guide-section">
          <div className="chapter-mark"><span>02</span><p>Your spirit animal is a clipboard</p></div>
          <div className="guide-statement"><p className="kicker">What happens in the clipboard stays in Pasted</p><h2>Pasted keeps <em>what <br/>your clipboard throws away.</em></h2><p>Pasted is the quiet accomplice between Copy and Paste. It catches what matters, gives it structure, and stays out of the way until you need it. No productivity doctrine. No mandatory cloud. No judgment about the thirty-seven tabs.</p></div>
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
          <div className="journey-grid">{journey.map(step => <article className="journey-card" data-step={step.number} key={step.number}><span>{step.number}</span><h3>{step.title.map(line => <span key={line}>{line}</span>)}</h3><p>{step.body}</p></article>)}</div>
        </section>

        <section className="feature-section" id="field-kit">
          <div className="chapter-mark"><span>04</span><p>Keep your pants on</p></div>
          <div className="section-intro"><p className="kicker">Go big or go Command-C</p><h2>Tiny toolbelt.<br/><em>Massive tool.</em></h2><p>Use one tool. Or all of them. Your clipboard has no idea what’s coming.</p></div>
          <div className="feature-grid">
            {features.map(feature => <article className={`feature-card feature-${feature.kind}`} key={feature.title}><span>{feature.icon}</span><FeaturePreview kind={feature.kind}/><h3>{feature.title}</h3><p>{feature.body}</p></article>)}
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
              <p>First successful commit: 1996. Merrrrrrge request still pending.</p>
            </article>
            <article className="experiment-card smith-experiment">
              <header><small>Specimen 03</small><span>Agent Smith</span></header>
              <div className="experiment-visual smith-line" aria-hidden="true"><i>01</i><i>01</i><i>01</i><i>01</i><i>01</i></div>
              <h3>Infinite instances. One dress code.</h3>
              <p>Me, me, me. Enterprise cloning with proprietary sunglasses.</p>
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
          <p>AI is becoming everything. Everything still needs context. A clipboard that remembers, organizes, <span className="transform-word" aria-label="transforms">{Array.from("transforms").map((letter, index) => <span className="transform-letter" data-char={letter} aria-hidden="true" style={{ "--char-index": index } as CSSProperties} key={`${letter}-${index}`}>{letter}</span>)}</span>, and exposes its history is a very small piece of software with a very large future.</p>
        </section>

        <section className="release-section" id="download">
          <div className="release-copy">
            <p className="kicker">The boring part, suspiciously well documented</p>
            <h2>Download with confidence.<br/><em>Or at least checksums.</em></h2>
            <p>Pasted is open source, keeps its core library on your device, and ships with enough receipts to make a clipboard app look oddly responsible.</p>
            <div className="release-facts">
              <article><span>⌘</span><div><strong>macOS</strong><small>Signed and notarized by Apple.</small></div></article>
              <article><span>▣</span><div><strong>Linux</strong><small>AppImage tested on SteamOS.</small></div></article>
              <article><span>#</span><div><strong>Checksums</strong><small>SHA-256 receipts included.</small></div></article>
              <article><span>⊞</span><div><strong>Windows</strong><small>Coming eventually. Installing updates.</small></div></article>
            </div>
          </div>
          <ReleaseVault />
        </section>

        <FeedbackTerminal />

        <section className="final-cta">
          <div className="cell-colony" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} />)}</div>
          <img src="/pasted-mark.svg" alt=""/><h2>Get Pasted tonight.<br/><em>Remember everything tomorrow.</em></h2><p>No matter how many shots you take, Pasted will be there, holding your hair, rubbing your back, and not judging you for your clipboard history.</p><a className="button primary" href="#download">Get Pasted <span>↑</span></a>
        </section>

      </main>

      <footer><a className="brand footer-brand" href="#top"><span className="brand-mark"><img src="/pasted-mark.svg" alt="" /></span>Pasted</a><p>Made by Triple J Software, Inc. Copy irresponsibly.</p><div><button type="button" className="irresponsible-trigger" onClick={() => setIrresponsible(value => !value)}>{irresponsible ? "Act responsibly" : "Do not press"}</button><a href={repoUrl}>GitHub</a><a href={`${repoUrl}/releases`}>Releases</a><a href="#listening">Good at Listening</a></div></footer>
    </div>
  );
}
