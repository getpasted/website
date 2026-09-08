import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type CinematicFeatureProps = {
  alt: string;
  description: string;
  footnote?: string;
  headline: ReactNode;
  id?: string;
  image: string;
  kicker: string;
  marker: string;
  stats: Array<[string, string]>;
  tone: "activity" | "backup" | "classification" | "factory" | "functionality" | "history" | "insights" | "notes" | "queue" | "revisions" | "safekeeping" | "security" | "smartbin" | "transformations";
};

const screenshotWidths: Record<string, number> = {
  "/app-captures/pasted-activity-4x.png": 5524,
  "/app-captures/pasted-ai-transformations-4x.png": 5524,
  "/app-captures/pasted-analysis-4x.png": 4256,
  "/app-captures/pasted-app-lock-4x.png": 5524,
  "/app-captures/pasted-cli-reference-4x.png": 4256,
  "/app-captures/pasted-content-types-shell-command-4x.png": 4804,
  "/app-captures/pasted-factory-spaghetti-4x.png": 7052,
  "/app-captures/pasted-full-backup-export-import-4x.png": 5524,
  "/app-captures/pasted-functionality-4x.png": 5524,
  "/app-captures/pasted-history-command-center-4x.png": 4152,
  "/app-captures/pasted-insights-4x.png": 5524,
  "/app-captures/pasted-notes-timeline-repair-4x.png": 4804,
  "/app-captures/pasted-queue-4x.png": 4256,
  "/app-captures/pasted-revision-history-4x.png": 5524,
  "/app-captures/pasted-safekeeping-4x.png": 5384,
  "/app-captures/pasted-search-history-4x.png": 4256,
  "/app-captures/pasted-smart-bin-rules-4x.png": 5524,
};

function OptimizedScreenshot({ alt, className, image, sizes = "100vw" }: { alt: string; className?: string; image: string; sizes?: string }) {
  const basename = image.replace(/\.png$/, "");
  const width = screenshotWidths[image];

  return <picture className={className}>
    <source
      srcSet={`${basename}-1600w.webp 1600w, ${basename}.webp ${width}w`}
      sizes={sizes}
      type="image/webp"
    />
    <img src={image} alt={alt} width={width} height="3880" loading="lazy" decoding="async"/>
  </picture>;
}

const encoreFeatures = [
  {
    alt: "An abstract exploded view of Pasted Search History showing nine reusable searches and their wonderfully suspicious usage counts",
    description: "Rerun the useful searches. Remove the incriminating ones. Quietly accept that “Gary” has been searched 38 times and the situation is not improving.",
    image: "/app-captures/pasted-search-history-4x.png",
    kicker: "Search History",
    signal: "SEARCH / RECALL / DELETE",
    title: <>Find it again.<br/><em>Question it later.</em></>,
  },
  {
    alt: "An exploded close-up of Pasted Analysis settings showing its six-stage local analysis sequence and OCR status",
    description: "Capture, inspect, classify, extract, index, and suggest without asking a server to help. OCR makes images searchable, then politely reports that seventeen contained absolutely nothing useful.",
    image: "/app-captures/pasted-analysis-4x.png",
    kicker: "Local Analysis",
    signal: "CAPTURE / EXTRACT / SEARCH",
    title: <>It read the screenshot.<br/><em>It told no one.</em></>,
  },
  {
    alt: "An abstract close-up of Pasted's built-in CLI reference showing installation, history, search, notes, and revision commands",
    description: "Search, organize, annotate, and restore the same local library from a shell. Add JSON when the clipboard situation has progressed beyond human supervision.",
    image: "/app-captures/pasted-cli-reference-4x.png",
    kicker: "CLI",
    signal: "SEARCH / SCRIPT / --JSON",
    title: <>The GUI left.<br/><em>The library stayed.</em></>,
  },
  {
    alt: "An abstract exploded view of Pasted Activity showing a local audit trail of important library events",
    description: "See what changed without recording what was copied. The audit trail remembers the action, the outcome, and precisely when normal operations became negotiable.",
    image: "/app-captures/pasted-activity-4x.png",
    kicker: "Activity",
    signal: "EVENT / OUTCOME / LOCAL",
    title: <>Accountability.<br/><em>Minus the creepy part.</em></>,
  },
];

function CinematicFeature({ alt, description, footnote = "*Investigation pending.", headline, id, image, kicker, marker, stats, tone }: CinematicFeatureProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      entries => setVisible(entries.some(entry => entry.isIntersecting)),
      { threshold: .28 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`cinematic-app-feature cinematic-app-${tone}${visible ? " is-visible" : ""}`}
      id={id}
      aria-label={kicker}
      ref={sectionRef}
    >
      <OptimizedScreenshot className="cinematic-app-picture" image={image} alt={alt}/>
      <div className="cinematic-app-copy">
        <p className="cinematic-app-kicker"><span>{marker}</span> {kicker}</p>
        <h2>{headline}</h2>
        <p className="cinematic-app-description">{description}</p>
        <div className="cinematic-app-spec">
          {stats.map(([value, label]) => <span key={label}><b>{value}</b>{label}</span>)}
        </div>
        <small>{footnote}</small>
      </div>
      <div className="cinematic-app-datum" aria-hidden="true"><span>{tone === "history" ? "HISTORY / 684" : tone === "queue" ? "QUEUE / ORDER / PASTE" : tone === "notes" ? "CONTEXT / ATTACHED" : tone === "classification" ? "TYPE / SOURCE / MEANING" : tone === "functionality" ? "SIMPLE / FULL / YOURS" : tone === "insights" ? "COMPOSITION / SOURCES / TRENDS" : tone === "activity" ? "EVENT / OUTCOME / LOCAL" : tone === "revisions" ? "COMPARE / RESTORE / CONTINUE" : tone === "safekeeping" ? "KEEP / LOCK / HIDE" : tone === "backup" ? "BACKUP / RECOVERY / RELIEF" : tone === "smartbin" ? "RULE / MATCH / FILED" : tone === "transformations" ? "INTENT / PLAN / REPEAT" : tone === "security" ? "LOCK / UNLOCK / CAPTURE" : "BIN 10 / 12"}</span><i/></div>
    </section>
  );
}

function EncoreReel() {
  const introRef = useRef<HTMLElement>(null);
  const [introVisible, setIntroVisible] = useState(false);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;

    const observer = new IntersectionObserver(
      entries => setIntroVisible(entries.some(entry => entry.isIntersecting)),
      { threshold: .35 },
    );
    observer.observe(intro);
    return () => observer.disconnect();
  }, []);

  return <section className="encore-reel" id="encore-reel" aria-labelledby="encore-reel-title">
    <header className={`encore-reel-intro${introVisible ? " is-visible" : ""}`} ref={introRef}>
      <p className="kicker">The encore reel</p>
      <h2 id="encore-reel-title">Small features.<br/><em>Excessive close-ups.</em></h2>
      <p>The details that don’t need a monument still deserve one last dramatic angle.</p>
    </header>
    <div className="encore-reel-grid">
      {encoreFeatures.map(feature => <EncoreCard feature={feature} key={feature.kicker}/>)}
    </div>
  </section>;
}

function EncoreCard({ feature }: { feature: (typeof encoreFeatures)[number] }) {
  const cardRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      entries => setVisible(entries.some(entry => entry.isIntersecting)),
      { threshold: .18 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return <article className={`encore-card${visible ? " is-visible" : ""}`} ref={cardRef}>
    <div className="encore-card-image"><OptimizedScreenshot image={feature.image} alt={feature.alt} sizes="(max-width: 900px) calc(100vw - 100px), 70vw"/></div>
    <div className="encore-card-copy">
      <p>{feature.kicker}</p>
      <h3>{feature.title}</h3>
      <span>{feature.description}</span>
      <small>{feature.signal}</small>
    </div>
  </article>;
}

export function CinematicAppFeature() {
  return <div className="cinematic-app-sequence">
    <CinematicFeature
      id="inside-the-app"
      tone="factory"
      marker="⚙"
      kicker="Factory Spaghetti · 27 clips"
      image="/app-captures/pasted-factory-spaghetti-4x.png"
      alt="Pasted showing a Factory Spaghetti Bin and its collection of delightfully over-engineered clips"
      headline={<>The factory<br/>must grow.<br/><em>Your clipboard<br/>already did.</em></>}
      description="Belt math. Train-intersection malpractice. One completely normal mining-speed modifier. Pasted keeps every critical fragment organized while the weekend quietly leaves the chat."
      stats={[["27", "fragments"], ["0", "bottlenecks*"], ["1", "weekend missing"]]}
    />
    <CinematicFeature
      tone="functionality"
      marker="⌘"
      kicker="Functionality · Full"
      image="/app-captures/pasted-functionality-4x.png"
      alt="An exploded close-up of Pasted Functionality settings showing independently controlled Bins, Naming, Notes, Pinning, Protection, Concealment, Trash, and Revision History"
      headline={<>I did mean to<br/><em>turn you on.</em></>}
      description="Enable exactly the clipboard system you want. Bins, Notes, Pinning, Protection, Concealment, Revision History, and the gloriously optional machinery beyond them all stay independently controlled."
      footnote="*Restraint remains available under Simple."
      stats={[["2", "presets"], ["full", "current mood"], ["0", "features forced*"]]}
    />
    <CinematicFeature
      tone="history"
      marker="↶"
      kicker="History · 684 clips"
      image="/app-captures/pasted-history-command-center-4x.png"
      alt="Pasted History showing hundreds of clips and a selected command with its attached note"
      headline={<>Your clipboard<br/>has a past.<br/><em>We kept<br/>the evidence.</em></>}
      description="Commands that ran for six hours. Links that seemed important at 2 a.m. The sentence that finally behaved. Search 684 clips without reconstructing the crime scene."
      stats={[["684", "memories"], ["1", "clipboard slot"], ["0", "credible alibis*"]]}
    />
    <CinematicFeature
      tone="notes"
      marker="▱"
      kicker="Tentacle Timeline Repair · 4 notes"
      image="/app-captures/pasted-notes-timeline-repair-4x.png"
      alt="Pasted showing four notes attached to a suspicious production hotfix from yesterday"
      headline={<>Leave a note.<br/>Save the timeline.<br/><em>Blame yesterday.</em></>}
      description="Yesterday’s production hotfix is tomorrow’s archaeological dig. Attach the warning, the hamster count, and the exact century nobody should deploy from."
      stats={[["4", "eyewitnesses"], ["1", "hamster"], ["0", "stable timelines*"]]}
    />
    <CinematicFeature
      tone="queue"
      marker="↳"
      kicker="Copy Queue · 6 in buffer"
      image="/app-captures/pasted-queue-4x.png"
      alt="An exploded close-up of Pasted showing an active six-item Copy Queue and its next paste target"
      headline={<>Paste in<br/>formation.<br/><em>Chaos,<br/>queued.</em></>}
      description="Collect a sequence once, then send it back out in precisely the right order. Ideal for forms, deployments, and rituals whose steps must not be improvised."
      footnote="*Order preserved. Confidence remains non-transactional."
      stats={[["6", "lined up"], ["1", "next up"], ["0", "steps improvised*"]]}
    />
    <CinematicFeature
      id="revision-history"
      tone="revisions"
      marker="↶"
      kicker="Revision History · 6 versions"
      image="/app-captures/pasted-revision-history-4x.png"
      alt="An exploded view of Pasted showing six restorable versions of a suspicious production hotfix"
      headline={<>Purple won.<br/><em>Try again yesterday.</em></>}
      description="Every edit leaves a restorable version behind. Compare the panic, rewind past Bernard’s approval, and return to the timeline where Purple Tentacle never noticed."
      footnote="*Hamster-based rollback remains experimental."
      stats={[["6", "versions"], ["11 hr", "of bad ideas"], ["1", "timeline restored*"]]}
    />
    <CinematicFeature
      tone="classification"
      marker="⌁"
      kicker="Content Types · Shell Command"
      image="/app-captures/pasted-content-types-shell-command-4x.png"
      alt="Pasted recognizing Shell Commands among clips from Terminal, Hyper, and other source applications"
      headline={<>What it is.<br/><em>What it isn’t.</em></>}
      description="A command is not prose, even when it contains a desperate whisper. Pasted recognizes links, code, paths, and shell commands—then remembers which app committed the act."
      stats={[["56", "commands"], ["11", "sources"], ["1", "polite whisper*"]]}
    />
    <CinematicFeature
      tone="smartbin"
      marker="⌘"
      kicker="Smart Bin · 18 matches"
      image="/app-captures/pasted-smart-bin-rules-4x.png"
      alt="Pasted editing a Smart Bin named Piracy as a Service beside automatically matched ScummVM clips"
      headline={<>Behind you!<br/><em>A three-headed<br/>Smart Bin.</em></>}
      description="Set the rules once. Pasted automatically corrals every rubber chicken, three-headed monkey sighting, and vocabulary-dependent duel into the correct corner of the Caribbean."
      footnote="*Sword-fighting proficiency remains vocabulary-dependent."
      stats={[["2", "rules"], ["18", "matches"], ["0", "clips filed by hand*"]]}
    />
    <CinematicFeature
      tone="insights"
      marker="▥"
      kicker="Insights · Current History"
      image="/app-captures/pasted-insights-4x.png"
      alt="An exploded Pasted Insights dashboard showing 684 clips, source composition, Content Types, and library statistics"
      headline={<>Your clipboard<br/>has entered its<br/><em>analytics era.</em></>}
      description="See what fills History, where it came from, and which Content Types have quietly colonized it. Useful composition and capture trends, without phoning home."
      footnote="*The spreadsheet phase begins tomorrow."
      stats={[["684", "clips"], ["35,232", "characters"], ["11", "sources implicated*"]]}
    />
    <CinematicFeature
      tone="security"
      marker="▣"
      kicker="App Lock · Authentication and Capture"
      image="/app-captures/pasted-app-lock-4x.png"
      alt="A monumental close-up of Pasted App Lock settings with authentication, biometric unlock, and automatic locking controls"
      headline={<>Some things<br/>should stay between<br/><em>you and ⌘V.</em></>}
      description="Require authentication before showing your history. Unlock with Touch ID or Apple Watch, then auto-lock before the person behind you learns why banana handset procurement was pinned."
      footnote="*The suspicious folder knows what it did."
      stats={[["3", "ways back in"], ["5 min", "until relock"], ["0", "shoulder surfers*"]]}
    />
    <CinematicFeature
      tone="safekeeping"
      marker="⌁"
      kicker="Pinned · Protected · Concealed"
      image="/app-captures/pasted-safekeeping-4x.png"
      alt="A close-up of Pasted showing exact counts for pinned, protected, and concealed clips alongside clip controls"
      headline={<>Keep it close.<br/>Lock it down.<br/><em>Pretend it<br/>never happened.</em></>}
      description="Pin what matters. Protect what absolutely cannot disappear. Conceal what should not be visible over somebody’s shoulder during the quarterly review."
      stats={[["29", "pinned"], ["14", "protected"], ["8", "plausibly denied*"]]}
    />
    <CinematicFeature
      tone="backup"
      marker="⇩"
      kicker="Full Backup · Full Restore"
      image="/app-captures/pasted-full-backup-export-import-4x.png"
      alt="Pasted Full Backup controls showing everything included in a recovery-ready snapshot and the adjacent import workflow"
      headline={<>Pack the whole thing.<br/><em>Leave the<br/>credentials.</em></>}
      description="Clips, Bins, notes, revisions, automations, and the window arrangement you spent forty minutes perfecting. One recovery-ready snapshot. Credentials remain safely in their system stores."
      footnote="*Original external files remain where you left them. Hopefully."
      stats={[["1", "complete snapshot"], ["all", "app-owned data"], ["0", "credentials copied"]]}
    />
    <CinematicFeature
      tone="transformations"
      marker="✦"
      kicker="AI-Assisted Transform · Revision 4"
      image="/app-captures/pasted-ai-transformations-4x.png"
      alt="An exploded Pasted Transformations library showing reusable AI-assisted recipes, deterministic local transforms, and the selected semantic plan"
      headline={<>Say what you mean.<br/><em>Reuse what it understood.</em></>}
      description="Describe the outcome once. Pasted plans a reusable AI-assisted transform, remembers every semantic step, and keeps the deterministic stuff local and replayable."
      footnote="*No professional composure was present in the source material."
      stats={[["4", "AI-assisted"], ["2", "local + replayable"], ["1", "panic converted*"]]}
    />
    <EncoreReel/>
  </div>;
}
