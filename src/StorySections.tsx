import { ClipboardTrail } from "./ClipboardTrail";
import { useScrollReveal } from "./useScrollReveal";
import "./story.css";
import { CliTerminal } from "./CliTerminal";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, RefObject } from "react";

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
  { kind: "analysis", icon: "◎", title: "Analysis", body: "Make images and audio searchable with local OCR and transcription, then classify useful Content Types." },
  { kind: "cli", icon: "›_", title: "CLI", body: "The GUI points and clicks. The CLI pipes, scripts, and generally gets carried away." },
  { kind: "sqlite", icon: "◎", title: "SQLite", body: "Your core library lives on your machine. The cloud is where it doesn’t." },
];

const pointerAngle = (event: ReactPointerEvent<HTMLButtonElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();
  return Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2));
};

const normalizedAngleDelta = (next: number, previous: number) => {
  let delta = next - previous;
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return delta / (Math.PI * 2);
};

type ScratchAnimation = {
  delay: number;
  duration: number;
  element: HTMLElement;
};

const cssTimeToMilliseconds = (value: string) => {
  const firstValue = value.split(",")[0]?.trim() ?? "0s";
  return firstValue.endsWith("ms") ? Number.parseFloat(firstValue) : Number.parseFloat(firstValue) * 1000;
};

const ScratchableHistoryRecord = ({ timelineRef }: { timelineRef: RefObject<HTMLDivElement | null> }) => {
  const [scratching, setScratching] = useState(false);
  const isScratching = useRef(false);
  const lastAngle = useRef(0);
  const timelineAnimations = useRef<ScratchAnimation[]>([]);

  const moveTimeline = (turns: number) => {
    timelineAnimations.current.forEach(animation => {
      animation.delay -= turns * animation.duration;
      animation.element.style.animationDelay = `${animation.delay}ms`;
    });
  };

  useEffect(() => {
    const resumeTimeline = () => {
      if (!isScratching.current) return;
      isScratching.current = false;
      timelineAnimations.current.forEach(animation => { animation.element.style.animationPlayState = "running"; });
      setScratching(false);
    };
    window.addEventListener("pointerup", resumeTimeline);
    window.addEventListener("pointercancel", resumeTimeline);
    return () => {
      window.removeEventListener("pointerup", resumeTimeline);
      window.removeEventListener("pointercancel", resumeTimeline);
      timelineAnimations.current.forEach(animation => { animation.element.style.animationPlayState = "running"; });
    };
  }, []);

  const beginScratch = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    isScratching.current = true;
    lastAngle.current = pointerAngle(event);
    const animatedElements = timelineRef.current?.querySelectorAll<HTMLElement>("*") ?? [];
    timelineAnimations.current = Array.from(animatedElements).flatMap(element => {
      const style = window.getComputedStyle(element);
      const duration = cssTimeToMilliseconds(style.animationDuration);
      if (style.animationName === "none" || !Number.isFinite(duration) || duration <= 0) return [];
      const animation = { delay: cssTimeToMilliseconds(style.animationDelay), duration, element };
      element.style.animationPlayState = "paused";
      return [animation];
    });
    event.currentTarget.setPointerCapture(event.pointerId);
    setScratching(true);
  };

  const scratch = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isScratching.current) return;
    const nextAngle = pointerAngle(event);
    moveTimeline(normalizedAngleDelta(nextAngle, lastAngle.current));
    lastAngle.current = nextAngle;
  };

  const releaseScratch = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isScratching.current) return;
    isScratching.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    timelineAnimations.current.forEach(animation => { animation.element.style.animationPlayState = "running"; });
    setScratching(false);
  };

  return (
    <>
      <button
        type="button"
        className={`history-record-position${scratching ? " is-scratching" : ""}`}
        aria-label="Scratch the record to scrub the Clip, Paste, and History animations"
        onPointerDown={beginScratch}
        onPointerMove={scratch}
        onPointerUp={releaseScratch}
        onPointerCancel={releaseScratch}
        onLostPointerCapture={releaseScratch}
      >
        <span className="history-record-wobble" aria-hidden="true">
          <span className="history-record"><i/><b/></span>
        </span>
      </button>
      <div className="history-record-speed" aria-hidden="true"><span>33⅓ RPM</span><strong>{scratching ? "SCRATCHING HISTORY" : "SPIN ME RIGHT ROUND"}</strong></div>
    </>
  );
};

function FeaturePreview({ kind }: { kind: string }) {
  if (kind === "history") return <div className="feature-preview preview-history" aria-hidden="true"><i>09:41</i><b>That perfect sentence</b><i>09:38</i><span>The link from earlier</span></div>;
  if (kind === "bins") return <div className="feature-preview preview-bins" aria-hidden="true"><span>🌭 Manual</span><span>💬 Replies</span><span>🔗 Links</span></div>;
  if (kind === "transforms") return <div className="feature-preview preview-transforms" aria-hidden="true"><code>messy text</code><i>✦</i><code>**clean text**</code></div>;
  if (kind === "analysis") return <div className="feature-preview preview-analysis" aria-hidden="true"><span>OCR</span><span>AUDIO</span><span>URL</span><span>EMAIL</span></div>;
  if (kind === "cli") return <div className="feature-preview preview-cli" aria-hidden="true"><code><b>$</b> pasted search "that thing"</code><small>Found. Obviously.</small></div>;
  return <div className="feature-preview preview-sqlite" aria-hidden="true"><span>clips</span><span>bins</span><span>revisions</span><i>LOCAL</i></div>;
}

const journey = [
  { number: "01", title: ["Copy first.", "Ask questions last."], body: "Change nothing. Pasted catches text, links, images, files, and the strange fragments between them." },
  { number: "02", title: ["There’s no place like", "wherever you decide."], body: "Pin the critical bits. Drop clips into Bins. Let rules do the work you were definitely getting around to." },
  { number: "03", title: ["Search around.", "Find out."], body: "We made eventually instant. Use search, the HUD, history, or the CLI and bring anything back ready to work." },
];

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

  useEffect(() => () => {
    if (copiedReset.current !== undefined) window.clearTimeout(copiedReset.current);
  }, []);

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
    <section className="clipboard-lab" id="clipboard-lab" aria-labelledby="clipboard-lab-title">
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
            {pastedHistory.length === 0 ? <p className="empty-evidence">Ready to an unreasonable degree.</p> : <div className="evidence-stack">{pastedHistory.map((item, index) => (
              <div className="evidence-slot" style={{ "--evidence-index": index } as CSSProperties} key={item.text}><div className="evidence retained"><span>0{pastedHistory.length - index}</span><b className="copy-count">×{item.copies}</b><p>{item.text}</p></div></div>
            ))}</div>}
          </article>
        </div>
      </div>
    </section>
  );
}

export function StorySections() {
  useScrollReveal(
    ".enemy-copy,.guide-statement,.split-copy,.cli-section>div:first-child",
    ".amnesia-machine,.field-note,.privacy-card,.terminal",
    ".feature-section>.chapter-mark,.feature-card,.story-intro,.story-card,.journey-section>.chapter-mark,.journey-card,.prior-art-section>.chapter-mark,.prior-art-section>.section-intro,.experiment-card,.resolution-section>.chapter-mark,.resolution-section>h2,.resolution-section>p,.clipboard-lab>.chapter-mark,.lab-intro,.copy-deck,.clipboard-results",
  );
  const storyTimelineRef = useRef<HTMLDivElement>(null);
  return <>
    <ClipboardTrail />
    <h1 className="story-page-title">The Pasted story</h1>
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
          <div className="story-grid" ref={storyTimelineRef}>
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
              <div className="story-stage">
                <ScratchableHistoryRecord timelineRef={storyTimelineRef}/>
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
          <div className="split-copy"><p className="kicker">What happens on your computer stays on your computer</p><h2>There’s no place<br/><em>like ~/.</em></h2><p>Clipboard history can contain passwords, code, medical forms, terrible first drafts, and the address of the surprise party. Pasted keeps its core library local and makes every outside connection your decision.</p><ul><li><span>✓</span> Local SQLite library</li><li><span>✓</span> Optional AI connections</li><li><span>✓</span> Import, export, and reset controls</li></ul></div>
          <div className="privacy-card"><div className="privacy-orbit"><span className="lock">⌾</span><i className="orbit-one"/><i className="orbit-two"/></div><strong>Your business is none of ours.</strong><small>On your device, under your control.</small></div>
        </section>

        <section className="cli-section" id="cli">
          <div><p className="kicker">Speak softly and carry a big pipe</p><h2>Open the hatch.<br/><em>There’s a CLI underneath.</em></h2><p>Point and click until you’d rather pipe and script. These are real Pasted commands reading the same ridiculous clips and Bins as the app mock above.</p></div>
          <CliTerminal/>
        </section>

        <section className="prior-art-section">
          <div className="chapter-mark"><span>06</span><p>Prior art department</p></div>
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
          <div className="chapter-mark"><span>07</span><p>Are you even reading any of this?</p></div>
          <p className="kicker">The future is already here. It just forgot what you copied.</p>
          <h2>Give your memory<br/><em>an API.</em></h2>
          <p>AI is becoming everything. Everything still needs context. A clipboard that remembers, organizes, <span className="transform-word" aria-label="transforms">{Array.from("transforms").map((letter, index) => <span className="transform-letter" data-char={letter} aria-hidden="true" style={{ "--char-index": index } as CSSProperties} key={`${letter}-${index}`}>{letter}</span>)}</span>, and exposes its history is a very small piece of software with a very large future.</p>
        </section>
  </>;
}
