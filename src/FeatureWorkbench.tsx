import { useState } from "react";
import {
  Boxes,
  Check,
  DatabaseBackup,
  FileJson,
  History,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

type WorkbenchView = "bins" | "functionality" | "backup" | "lock" | "versions";

const views: Array<{ id: WorkbenchView; label: string; detail: string; icon: typeof Boxes }> = [
  { id: "bins", label: "Bins", detail: "Build a Smart Bin", icon: Boxes },
  { id: "functionality", label: "Functionality", detail: "Keep only what helps", icon: SlidersHorizontal },
  { id: "backup", label: "Backup and Export", detail: "Know what comes along", icon: DatabaseBackup },
  { id: "lock", label: "App Lock", detail: "Close the curtains", icon: LockKeyhole },
  { id: "versions", label: "Clip Versions", detail: "Unmake a mistake", icon: History },
];

function BinWorkbench() {
  const [created, setCreated] = useState(false);
  const [matchAll, setMatchAll] = useState(true);
  return <div className="workbench-pane bin-workbench">
    <div className="workbench-form">
      <div className="mini-heading"><span><Sparkles/> NEW SMART BIN</span><small>Nothing moves. Matches appear automatically.</small></div>
      <label>NAME<input value="Turntables I Can Explain" readOnly/></label>
      <div className="rule-builder">
        <div><span>MATCH</span><button type="button" onClick={() => setMatchAll(value => !value)}>{matchAll ? "ALL" : "ANY"} CONDITIONS</button></div>
        <p><b>Content Type</b><span>is</span><em>Product</em></p>
        <p><b>Text</b><span>contains</span><em>Technics</em></p>
        <p><b>Source</b><span>contains</span><em>Safari</em></p>
      </div>
      <button type="button" className="workbench-primary" onClick={() => setCreated(true)}>{created ? <><Check/> SMART BIN CREATED</> : <><Sparkles/> CREATE SMART BIN</>}</button>
    </div>
    <div className="bin-result">
      <header><span>◍</span><div><strong>Turntables I Can Explain</strong><small>{created ? "2 MATCHING CLIPS" : "LIVE PREVIEW · 2 MATCHES"}</small></div><b>2</b></header>
      <article><span>↗</span><div><strong>Safari</strong><p>Technics SL-1200 55th Anniversary Edition</p><small>Product · 1 month ago</small></div></article>
      <article><span>♪</span><div><strong>Music</strong><p>Cue lever lowered with the solemnity of a lunar landing</p><small>Observation · 1 month ago</small></div></article>
      <footer><ShieldCheck/> Smart rules organize references. They never duplicate clip data.</footer>
    </div>
  </div>;
}

const initialFeatures = [
  ["Clip Search", true],
  ["OCR", true],
  ["Transcriptions", false],
  ["Content Classification", true],
  ["Transformations", true],
  ["Activity History", true],
] as const;

function FunctionalityWorkbench() {
  const [features, setFeatures] = useState<Record<string, boolean>>(Object.fromEntries(initialFeatures));
  const [changed, setChanged] = useState("Everything is using its default.");
  const toggle = (name: string) => {
    const enabled = !features[name];
    setFeatures(current => ({ ...current, [name]: enabled }));
    setChanged(`${name} ${enabled ? "enabled" : "disabled"}. Existing data preserved.`);
  };
  return <div className="workbench-pane functionality-workbench">
    <div className="settings-window">
      <div className="mini-heading"><span><SlidersHorizontal/> FUNCTIONALITY</span><small>Turn off whole surfaces without erasing their data.</small></div>
      <div className="settings-toggles">{initialFeatures.map(([name]) => <button type="button" key={name} onClick={() => toggle(name)}><span><strong>{name}</strong><small>{name === "OCR" ? "Search text inside images" : name === "Transformations" ? "Reusable local and connected workflows" : "Available throughout Pasted"}</small></span><i className={features[name] ? "on" : ""}><b/></i></button>)}</div>
    </div>
    <div className="functionality-status"><i className="status-orbit"><b>{Object.values(features).filter(Boolean).length}</b></i><strong>{changed}</strong><p>Functionality gates suspend related controls, filters, rules, and commands. Re-enable one and its saved state is waiting.</p></div>
  </div>;
}

function BackupWorkbench() {
  const [mode, setMode] = useState<"full" | "transfer">("full");
  const [complete, setComplete] = useState(false);
  const choose = (next: "full" | "transfer") => { setMode(next); setComplete(false); };
  return <div className="workbench-pane backup-workbench">
    <div className="backup-choices">
      <button type="button" className={mode === "full" ? "active" : ""} onClick={() => choose("full")}><DatabaseBackup/><span><strong>Full Backup</strong><small>Complete snapshot for restoring this library.</small></span></button>
      <button type="button" className={mode === "transfer" ? "active" : ""} onClick={() => choose("transfer")}><FileJson/><span><strong>History and Organization</strong><small>Portable JSON for merging with another library.</small></span></button>
    </div>
    <div className="backup-detail">
      <header><span>{mode === "full" ? <DatabaseBackup/> : <FileJson/>}</span><div><strong>{mode === "full" ? "Everything Pasted owns" : "The portable parts"}</strong><small>{mode === "full" ? ".pastedbackup · validated SQLite snapshot" : ".json · validated before any import writes"}</small></div></header>
      <ul>{(mode === "full" ? ["684 clips, Trash, Queue, and Clip Versions", "13 Bins, Transforms, settings, and search history", "Activity plus meaningful interface and window state", "Pre-restore recovery backup before activation"] : ["History and Trash clips with notes, pins, and protection", "Bins, ordering, Transforms, and completed OCR state", "Merges without replacing unrelated destination data", "Search History and Activity stay with the original library"]).map(item => <li key={item}><Check/>{item}</li>)}</ul>
      <div className="backup-boundary"><ShieldCheck/><span><b>Stays external</b> Provider and operating-system credentials, plus original files referenced by File clips.</span></div>
      <button type="button" className="workbench-primary" onClick={() => setComplete(true)}>{complete ? <><Check/> {mode === "full" ? "BACKUP VALIDATED" : "EXPORT READY"}</> : mode === "full" ? "CREATE FULL BACKUP…" : "EXPORT HISTORY AND ORGANIZATION…"}</button>
    </div>
  </div>;
}

function LockWorkbench() {
  const [locked, setLocked] = useState(false);
  const [capture, setCapture] = useState(true);
  return <div className="workbench-pane lock-workbench">
    <div className="lock-settings">
      <div className="mini-heading"><span><LockKeyhole/> APP LOCK</span><small>Protects the interface. The local database is not encrypted by App Lock.</small></div>
      <div className="lock-policy"><span><strong>Lock after inactivity</strong><small>5 minutes</small></span><b>5 MIN</b></div>
      <button type="button" className="policy-toggle" onClick={() => setCapture(value => !value)}><span><strong>Capture while locked</strong><small>Keep new clips without revealing the library.</small></span><i className={capture ? "on" : ""}><b/></i></button>
      <div className="lock-checks"><span><Check/> Lock on sleep</span><span><Check/> Lock on restart</span><span><Check/> Use system authentication</span></div>
      <button type="button" className="workbench-primary" onClick={() => setLocked(true)}><LockKeyhole/> LOCK NOW</button>
    </div>
    <div className={`lock-preview${locked ? " is-locked" : ""}`}>
      {locked ? <div className="locked-screen"><i><LockKeyhole/></i><strong>Pasted is locked.</strong><p>{capture ? "Capture continues quietly behind the curtain." : "Capture is paused until the interface is unlocked."}</p><button type="button" onClick={() => setLocked(false)}>UNLOCK THIS MOCK</button></div> : <><div className="blurred-library" aria-hidden="true"><span/><span/><span/><span/></div><div className="unlocked-stamp"><ShieldCheck/><b>INTERFACE UNLOCKED</b><small>Nothing has left this device.</small></div></>}
    </div>
  </div>;
}

const versions = [
  { id: "current", label: "Current", time: "just now", text: "Pocket lint is the autobiography your trousers write without permission." },
  { id: "v3", label: "Version 3", time: "8 min", text: "Pocket lint is a tiny unauthorized biography of your trousers." },
  { id: "v2", label: "Version 2", time: "14 min", text: "Your pockets are writing about you in fiber and crumbs." },
  { id: "original", label: "Original", time: "22 min", text: "pocket lint essay idea???" },
];

function VersionsWorkbench() {
  const [selected, setSelected] = useState("v3");
  const [restored, setRestored] = useState(false);
  const version = versions.find(item => item.id === selected) ?? versions[0];
  return <div className="workbench-pane versions-workbench">
    <div className="version-list"><div className="mini-heading"><span><History/> CLIP VERSIONS</span><small>Content-changing actions leave a bounded way back.</small></div>{versions.map(item => <button type="button" className={selected === item.id ? "active" : ""} onClick={() => { setSelected(item.id); setRestored(false); }} key={item.id}><i/><span><strong>{item.label}</strong><small>{item.time}</small></span>{item.id === "current" && <b>CURRENT</b>}</button>)}</div>
    <div className="version-preview"><header><span>{version.label.toUpperCase()}</span><small>TEXT CLIP · NOTES</small></header><blockquote>{version.text}</blockquote><div className="version-note">Opening line for “What Your Pocket Lint Says About You.” Dryer is unreliable narrator.</div><button type="button" disabled={selected === "current"} onClick={() => setRestored(true)}>{restored ? <><Check/> RESTORED AS CURRENT</> : <><RotateCcw/> RESTORE THIS VERSION</>}</button><small>Original and Current cannot be deleted.</small></div>
  </div>;
}

export function FeatureWorkbench() {
  const [view, setView] = useState<WorkbenchView>("bins");
  return <section className="workbench-section" id="inside-the-app">
    <div className="chapter-mark"><span>05</span><p>Open every drawer</p></div>
    <div className="section-intro"><p className="kicker">The details are the product</p><h2>Less feature list.<br/><em>More actual Pasted.</em></h2><p>Click through a few literal pieces of the app. They use the real concepts, boundaries, and behavior—just with a library that has made some unusual research choices.</p></div>
    <div className="workbench-shell">
      <nav aria-label="Interactive Pasted feature demos">{views.map(item => <button type="button" className={view === item.id ? "active" : ""} onClick={() => setView(item.id)} key={item.id}><item.icon/><span><strong>{item.label}</strong><small>{item.detail}</small></span><b>›</b></button>)}</nav>
      <div className="workbench-screen" key={view}>{view === "bins" ? <BinWorkbench/> : view === "functionality" ? <FunctionalityWorkbench/> : view === "backup" ? <BackupWorkbench/> : view === "lock" ? <LockWorkbench/> : <VersionsWorkbench/>}</div>
    </div>
  </section>;
}
