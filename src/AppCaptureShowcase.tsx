import { useEffect, useState } from "react";
import { BarChart3, Boxes, DatabaseBackup, History, LockKeyhole, Pause, Play, SlidersHorizontal, Workflow } from "lucide-react";

const captures = [
  { id: "history", label: "History", detail: "Capture, organize, preview, and act", image: "/app-captures/pasted-history.jpg", alt: "The real Pasted History interface with clip list and full clip preview", icon: History },
  { id: "bins", label: "Smart Bins", detail: "Rules, transforms, and behavior", image: "/app-captures/pasted-smart-bin.jpg", alt: "The real Pasted New Bin dialog configured as a Smart Bin", icon: Boxes },
  { id: "functionality", label: "Functionality", detail: "Make the app exactly as large as needed", image: "/app-captures/pasted-functionality.jpg", alt: "The real Pasted Functionality settings with individual feature controls", icon: SlidersHorizontal },
  { id: "storage", label: "Storage", detail: "Full Backup, export, and recovery", image: "/app-captures/pasted-storage.jpg", alt: "The real Pasted Storage settings showing backup and export controls", icon: DatabaseBackup },
  { id: "security", label: "App Lock", detail: "Authentication and capture policy", image: "/app-captures/pasted-security.jpg", alt: "The real Pasted Security settings showing App Lock and auto-lock controls", icon: LockKeyhole },
  { id: "transforms", label: "Transforms", detail: "Build, test, and replay workflows", image: "/app-captures/pasted-transformations.jpg", alt: "The real Pasted Transformations library and transform editor", icon: Workflow },
  { id: "insights", label: "Insights", detail: "Local library composition and trends", image: "/app-captures/pasted-insights.jpg", alt: "The real Pasted Insights dashboard", icon: BarChart3 },
] as const;

export function AppCaptureShowcase() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % captures.length), 4400);
    return () => window.clearInterval(timer);
  }, [playing]);

  const current = captures[active];
  return <div className="app-capture-showcase" aria-label="Tour of Pasted">
    <div className="capture-window-bar">
      <span className="traffic red"/><span className="traffic yellow"/><span className="traffic green"/>
    </div>
    <figure>
      <div className={`capture-viewport capture-focus-${current.id}`}>
        <img className="active" src={current.image} alt={current.alt} key={current.id}/>
      </div>
      <figcaption><span><current.icon/><b>{current.label}</b></span><small>{current.detail}</small></figcaption>
    </figure>
    <div className="capture-controls">
      <div className="capture-tabs" role="tablist" aria-label="Pasted screens">{captures.map((capture, index) => <button type="button" role="tab" aria-selected={index === active} className={index === active ? "active" : ""} onClick={() => { setActive(index); setPlaying(false); }} key={capture.id}><capture.icon/><span><b>{capture.label}</b><small>{capture.detail}</small></span></button>)}</div>
      <button type="button" className="capture-play" onClick={() => setPlaying(value => !value)} aria-label={playing ? "Pause app capture tour" : "Play app capture tour"}>{playing ? <Pause/> : <Play/>}<span>{playing ? "PAUSE TOUR" : "PLAY TOUR"}</span></button>
    </div>
    <div className="capture-progress" aria-hidden="true"><i key={`${active}-${playing}`} className={playing ? "is-playing" : ""}/></div>
  </div>;
}
