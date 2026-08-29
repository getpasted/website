import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clipboard,
  Copy,
  History,
  ListOrdered,
  Pause,
  Pin,
  Play,
  Search,
  Shield,
  Sparkles,
  StickyNote,
  Trash2,
  Workflow,
} from "lucide-react";
import { demoBins, demoClips, demoLibraryTotal } from "./demoLibrary";

const initialPinned = ["insult-swordfighting", "dhh-sticker", "remember-parking"];
const initialProtected = ["hamster-warning", "remember-wifi", "toe-hair-chart"];
const initialQueue = ["pirate-job", "recipe-lasagna", "amazon-banana-phone", "omarchy-theme"];
const initialTrashed = ["amazon-finger-hands"];
const initialNoted = demoClips.filter(clip => clip.note).map(clip => clip.id);

type CollectionId = "history" | "queue" | "pinned" | "protected" | "noted" | "trashed" | `bin:${string}`;

const toggleId = (ids: string[], id: string) => ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id];

export function ProductWindow() {
  const clipStackRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [collectionId, setCollectionId] = useState<CollectionId>("bin:commerce");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [statusDetail, setStatusDetail] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState(initialPinned);
  const [protectedIds, setProtectedIds] = useState(initialProtected);
  const [queueIds, setQueueIds] = useState(initialQueue);
  const [trashedIds, setTrashedIds] = useState(initialTrashed);
  const [notedIds, setNotedIds] = useState(initialNoted);
  const [transformedIds, setTransformedIds] = useState<string[]>([]);
  const binCounts = useMemo(() => Object.fromEntries(demoBins.map(bin => [bin.id, demoClips.filter(clip => clip.bin === bin.id).length])), []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => {
      if (document.hidden) return;
      setSelectedIndex(current => {
        const next = (current + 1) % demoClips.length;
        setCollectionId(`bin:${demoClips[next].bin}`);
        setStatus(null);
        setStatusDetail(null);
        return next;
      });
    }, 2800);
    return () => window.clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (paused) return;
    const stack = clipStackRef.current;
    const active = stack?.querySelector<HTMLElement>("[data-active='true']");
    if (!stack || !active) return;
    const itemTop = active.offsetTop;
    const itemBottom = itemTop + active.offsetHeight;
    if (itemTop < stack.scrollTop) stack.scrollTop = itemTop;
    else if (itemBottom > stack.scrollTop + stack.clientHeight) stack.scrollTop = itemBottom - stack.clientHeight;
  }, [paused, selectedIndex]);

  const selectedClip = demoClips[selectedIndex] ?? demoClips[0];
  const binId = collectionId.startsWith("bin:") ? collectionId.slice(4) : null;
  const selectedBin = binId ? demoBins.find(bin => bin.id === binId) : null;
  const collectionClips = useMemo(() => {
    let clips = demoClips;
    if (binId) clips = demoClips.filter(clip => clip.bin === binId);
    else if (collectionId === "queue") clips = demoClips.filter(clip => queueIds.includes(clip.id));
    else if (collectionId === "pinned") clips = demoClips.filter(clip => pinnedIds.includes(clip.id));
    else if (collectionId === "protected") clips = demoClips.filter(clip => protectedIds.includes(clip.id));
    else if (collectionId === "noted") clips = demoClips.filter(clip => notedIds.includes(clip.id));
    else if (collectionId === "trashed") clips = demoClips.filter(clip => trashedIds.includes(clip.id));

    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return clips;
    return clips.filter(clip => [clip.app, clip.text, clip.detail, clip.contentType, clip.note]
      .some(value => value?.toLocaleLowerCase().includes(normalizedQuery)));
  }, [binId, collectionId, notedIds, pinnedIds, protectedIds, query, queueIds, trashedIds]);
  const activeClip = collectionClips.find(clip => clip.id === selectedClip.id) ?? collectionClips[0] ?? selectedClip;
  const activeBin = demoBins.find(bin => bin.id === activeClip.bin) ?? demoBins[0];
  const collectionName = selectedBin?.name ?? {
    history: "History",
    queue: "Queue",
    pinned: "Pinned",
    protected: "Protected",
    noted: "Noted",
    trashed: "Trashed",
  }[collectionId as Exclude<CollectionId, `bin:${string}`>] ?? "History";
  const chooseCollection = (nextCollection: CollectionId) => {
    setPaused(true);
    setCollectionId(nextCollection);
    setQuery("");
    setStatus("EXPLORE MODE · AUTOPLAY PAUSED");
    setStatusDetail(nextCollection.startsWith("bin:")
      ? demoBins.find(bin => bin.id === nextCollection.slice(4))?.name ?? "Custom Bin"
      : nextCollection[0].toUpperCase() + nextCollection.slice(1));
    const nextBinId = nextCollection.startsWith("bin:") ? nextCollection.slice(4) : null;
    const firstIndex = demoClips.findIndex(clip => nextBinId ? clip.bin === nextBinId : true);
    if (firstIndex >= 0) setSelectedIndex(firstIndex);
  };

  const chooseClip = (id: string) => {
    const nextIndex = demoClips.findIndex(clip => clip.id === id);
    const nextClip = demoClips[nextIndex];
    if (!nextClip) return;
    setPaused(true);
    setStatus(`${nextClip.contentType.toUpperCase()} SELECTED · ${nextClip.app.toUpperCase()}`);
    setStatusDetail(nextClip.text);
    setSelectedIndex(nextIndex);
  };

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("pasted-demo-clip-selected", { detail: { id: activeClip.id } }));
  }, [activeClip.id]);

  useEffect(() => {
    const selectFromCli = (event: Event) => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id;
      if (!id) return;
      const nextIndex = demoClips.findIndex(candidate => candidate.id === id);
      const clip = demoClips[nextIndex];
      if (!clip) return;
      setPaused(true);
      setCollectionId(`bin:${clip.bin}`);
      setSelectedIndex(nextIndex);
      setStatus(`${clip.contentType.toUpperCase()} SELECTED · ${clip.app.toUpperCase()}`);
      setStatusDetail(clip.text);
    };
    window.addEventListener("pasted-demo-select-clip", selectFromCli);
    return () => window.removeEventListener("pasted-demo-select-clip", selectFromCli);
  }, []);

  const runAction = (message: string, action?: () => void) => {
    setPaused(true);
    action?.();
    setStatus(message);
    setStatusDetail(activeClip.text);
  };

  const resume = () => {
    setPaused(false);
    setSearchOpen(false);
    setQuery("");
    setCollectionId(`bin:${activeClip.bin}`);
    setStatus(null);
    setStatusDetail(null);
  };

  return (
    <div className="product-window" aria-label="Animated preview of a fully used Pasted library">
      <div className="window-bar">
        <span className="traffic red" /><span className="traffic yellow" /><span className="traffic green" />
        <span className="window-title">Pasted</span>
        <span className={`library-health ${paused ? "is-paused" : ""}`}><i /> {paused ? "Explore mode" : `${demoLibraryTotal} clips · local`}</span>
      </div>
      <div className="product-grid">
        <aside className="app-sidebar">
          <p className="eyebrow">Clips</p>
          <button type="button" className={`nav-item ${collectionId === "history" ? "active" : ""}`} onClick={() => chooseCollection("history")}><span><Clipboard /></span> History <b>{demoLibraryTotal}</b></button>
          <button type="button" className={`nav-item ${collectionId === "queue" ? "active" : ""}`} onClick={() => chooseCollection("queue")}><span><ListOrdered /></span> Queue <b>{queueIds.length}</b></button>
          <button type="button" className={`nav-item pin ${collectionId === "pinned" ? "active" : ""}`} onClick={() => chooseCollection("pinned")}><span><Pin /></span> Pinned <b>{pinnedIds.length}</b></button>
          <button type="button" className={`nav-item protect ${collectionId === "protected" ? "active" : ""}`} onClick={() => chooseCollection("protected")}><span><Shield /></span> Protected <b>{protectedIds.length}</b></button>
          <button type="button" className={`nav-item noted ${collectionId === "noted" ? "active" : ""}`} onClick={() => chooseCollection("noted")}><span><StickyNote /></span> Noted <b>{notedIds.length}</b></button>
          <button type="button" className={`nav-item trashed ${collectionId === "trashed" ? "active" : ""}`} onClick={() => chooseCollection("trashed")}><span><Trash2 /></span> Trashed <b>{trashedIds.length}</b></button>
          <p className="eyebrow bins">Bins</p>
          <div className="bin-scroll" aria-label="Custom bins">
            {demoBins.map(bin => (
              <button type="button" className={`nav-item demo-bin ${collectionId === `bin:${bin.id}` ? "active" : ""}`} key={bin.id} title={bin.rule} onClick={() => chooseCollection(`bin:${bin.id}`)}>
                <span>{bin.icon}</span><em>{bin.name}</em><b>{binCounts[bin.id]}</b>
              </button>
            ))}
          </div>
        </aside>
        <section className="clip-list">
          <div className="list-head">
            <div><span className="bin-kind">{selectedBin?.kind === "smart" ? <Sparkles /> : <Clipboard />}</span>{searchOpen ? <input autoFocus value={query} onChange={event => { setPaused(true); setQuery(event.target.value); }} placeholder="Search this collection…" aria-label="Search mocked clips" /> : <strong>{collectionName}</strong>}</div>
            <span><button type="button" className={searchOpen ? "active" : ""} onClick={() => { setPaused(true); setSearchOpen(value => !value); setStatus("SEARCH READY · TRY ‘HAMSTER’"); setStatusDetail(collectionName); }} aria-label="Search clips"><Search /></button><button type="button" onClick={paused ? resume : () => { setPaused(true); setStatus("EXPLORE MODE · EVERYTHING IS CLICKABLE"); setStatusDetail(activeClip.text); }} aria-label={paused ? "Resume app preview" : "Pause app preview"}>{paused ? <Play /> : <Pause />}</button></span>
          </div>
          {selectedBin?.rule && <div className="smart-rule"><Sparkles /> {selectedBin.rule}</div>}
          <div className="clip-stack" ref={clipStackRef}>
            {collectionClips.map(clip => (
              <button type="button" className={`clip-card ${clip.id === activeClip.id ? "selected" : ""}`} data-active={clip.id === activeClip.id} key={clip.id} onClick={() => chooseClip(clip.id)}>
                <span className={`clip-icon ${clip.tone}`}>{clip.icon}</span>
                <div><strong>{clip.app}</strong><p>{clip.text}</p><small>{clip.contentType}</small></div>
                <time>{clip.meta}</time>
              </button>
            ))}
            {!collectionClips.length && <div className="demo-empty"><Search /><strong>No clips found.</strong><span>The hamster may be in another mansion.</span></div>}
          </div>
        </section>
        <section className="clip-preview" key={activeClip.id}>
          <div className="preview-head"><span className="type-pill">{activeClip.clipType}</span><strong>{activeClip.app}</strong><span className="preview-actions"><button type="button" className={transformedIds.includes(activeClip.id) ? "active" : ""} onClick={() => runAction(transformedIds.includes(activeClip.id) ? "TRANSFORM UNDONE · ORIGINAL RESTORED" : "TRANSFORM APPLIED · REVISION SAVED", () => setTransformedIds(ids => toggleId(ids, activeClip.id)))} aria-label="Apply transform"><Workflow /></button><button type="button" onClick={() => runAction("COPIED BACK · THE CYCLE CONTINUES")} aria-label="Copy clip"><Copy /></button><button type="button" className={pinnedIds.includes(activeClip.id) ? "active" : ""} onClick={() => runAction(pinnedIds.includes(activeClip.id) ? "UNPINNED · FREE TO ROAM" : "PINNED · DRAMATICALLY IMPORTANT", () => setPinnedIds(ids => toggleId(ids, activeClip.id)))} aria-label="Toggle pinned"><Pin /></button><button type="button" className={protectedIds.includes(activeClip.id) ? "active" : ""} onClick={() => runAction(protectedIds.includes(activeClip.id) ? "PROTECTION REMOVED · LIVE DANGEROUSLY" : "PROTECTED · RETENTION CANNOT HAVE IT", () => setProtectedIds(ids => toggleId(ids, activeClip.id)))} aria-label="Toggle protected"><Shield /></button><button type="button" className={notedIds.includes(activeClip.id) ? "active" : ""} onClick={() => runAction(notedIds.includes(activeClip.id) ? "NOTE UNFLAGGED · CONTEXT WITHDRAWN" : "NOTE FLAGGED · FUTURE YOU HAS BEEN WARNED", () => setNotedIds(ids => toggleId(ids, activeClip.id)))} aria-label="Toggle note"><StickyNote /></button><button type="button" className={trashedIds.includes(activeClip.id) ? "active danger" : "danger"} onClick={() => runAction(trashedIds.includes(activeClip.id) ? "RESTORED · SECOND CHANCES ARE LOCAL" : "MOVED TO TRASH · STILL RECOVERABLE", () => setTrashedIds(ids => toggleId(ids, activeClip.id)))} aria-label="Toggle trash"><Trash2 /></button></span></div>
          <div className="preview-body">
            <div className="preview-label">CLIP CONTENT · {activeClip.contentType.toUpperCase()}</div>
            <p>{activeClip.text}</p>
            {activeClip.detail && <div className="preview-detail">{activeClip.detail}</div>}
            {transformedIds.includes(activeClip.id) && <div className="transform-result"><Sparkles /> TRANSFORM PREVIEW · REVISION 2</div>}
            {activeClip.note && notedIds.includes(activeClip.id) && <div className="preview-note"><StickyNote /><span><b>NOTE</b>{activeClip.note}</span></div>}
          </div>
          <div className="preview-meta"><span>CHARS<br/><b>{activeClip.text.length}</b></span><span>WORDS<br/><b>{activeClip.text.split(/\s+/).length}</b></span><span>CAPTURED<br/><b>{activeClip.meta}</b></span></div>
        </section>
      </div>
      <div className="capture-signal" aria-live="polite" key={activeClip.id}>
        <span><History /></span>
        <div><strong>{status ?? activeClip.moment}</strong><small>{statusDetail ?? `${activeBin.icon} ${activeBin.name}${paused ? " · click around" : ""}`}</small></div>
      </div>
      <div className="demo-timeline" aria-hidden="true"><i style={{ width: `${((selectedIndex + 1) / demoClips.length) * 100}%` }} /></div>
    </div>
  );
}
