import { useEffect, useRef, useState } from "react";
import { Boxes, DatabaseBackup, History, LockKeyhole, MousePointer2, Play, SlidersHorizontal, Workflow } from "lucide-react";

const scenes = [
  {
    id: "history",
    eyebrow: "History, without the archaeology",
    title: "Every copy lands somewhere useful.",
    description: "Watch a half-remembered fragment become a selected clip, a full preview, and a useful action—without the interface losing its place.",
    image: "/app-captures/pasted-history.jpg",
    alt: "The real Pasted History interface with the sidebar, clip list, and preview visible",
    icon: History,
    annotation: "FOUND: THE THING FROM EARLIER",
    note: "Selection changes. Context stays put.",
    tags: ["684 clips", "instant preview", "no list reload"],
  },
  {
    id: "bins",
    eyebrow: "Put the pile to work",
    title: "A Bin can organize itself.",
    description: "Build a Smart Bin, layer in rules, choose what happens next, and let the clipboard quietly file its own paperwork.",
    image: "/app-captures/pasted-smart-bin.jpg",
    alt: "The real Pasted Smart Bin builder with rules and behavior controls",
    icon: Boxes,
    annotation: "OMARCHY RABBIT HOLE: ARMED",
    note: "Safari + URL → exactly where it belongs.",
    tags: ["smart rules", "automatic transforms", "protect + conceal"],
  },
  {
    id: "functionality",
    eyebrow: "Use the whole machine—or don’t",
    title: "Pasted gets out of its own way.",
    description: "Turn major capabilities on and off individually. The interface reconfigures around the workflow instead of asking the workflow to accommodate it.",
    image: "/app-captures/pasted-functionality.jpg",
    alt: "The real Pasted Functionality settings with individual feature switches",
    icon: SlidersHorizontal,
    annotation: "FULL POWER / ZERO OBLIGATION",
    note: "One switch. An entire layer disappears.",
    tags: ["simple or full", "feature switches", "live reconfiguration"],
  },
  {
    id: "storage",
    eyebrow: "The escape hatch is a first-class feature",
    title: "Back up everything. Keep owning it.",
    description: "Create a Full Backup, move the database, or export portable History and Organization. Recovery is designed in, not stapled on later.",
    image: "/app-captures/pasted-storage.jpg",
    alt: "The real Pasted Storage settings with database, backup, and export controls",
    icon: DatabaseBackup,
    annotation: "FULL BACKUP: BOTTLED",
    note: "Library, organization, revisions, and interface state.",
    tags: ["Full Backup", "portable JSON", "pre-restore recovery"],
  },
  {
    id: "security",
    eyebrow: "Private means more than local",
    title: "Lock the app. Keep the capture.",
    description: "Require authentication before revealing clipboard history, choose the auto-lock policy, and decide whether capture continues behind the lock.",
    image: "/app-captures/pasted-security.jpg",
    alt: "The real Pasted Security settings with App Lock and auto-lock controls",
    icon: LockKeyhole,
    annotation: "TOUCH ID STAYS WITH macOS",
    note: "The interface locks. The operating system authenticates.",
    tags: ["App Lock", "auto-lock", "capture policy"],
  },
  {
    id: "transforms",
    eyebrow: "The clipboard is now programmable",
    title: "Build it once. Replay it anywhere.",
    description: "Assemble transformations, test them in the Playground, and run the same behavior from the app or the CLI.",
    image: "/app-captures/pasted-transformations.jpg",
    alt: "The real Pasted Transformations library and operation builder",
    icon: Workflow,
    annotation: "messy text → **CLEAN TEXT**",
    note: "One library. GUI and CLI in agreement.",
    tags: ["local transforms", "Playground", "CLI parity"],
  },
] as const;

type Scene = typeof scenes[number];

function CinematicStage({ scene, hero = false }: { scene: Scene; hero?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(hero);
  const [take, setTake] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.28, rootMargin: "80px 0px" });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return <div ref={stageRef} className={`cinema-stage cinema-${scene.id}${hero ? " cinema-hero" : ""}${visible ? " is-playing" : ""}`}>
    <div className="cinema-take" key={take}>
      <div className="cinema-window-bar" aria-hidden="true">
        <span><i/><i/><i/></span><b>Pasted — {scene.id}</b><em>REAL INTERFACE · TAKE {String(take + 1).padStart(2, "0")}</em>
      </div>
      <div className="cinema-screen">
        <img className="cinema-base" src={scene.image} alt={scene.alt} loading={hero ? "eager" : "lazy"}/>
        <div className="cinema-shutter" aria-hidden="true"/>
        <div className="cinema-exploded" aria-hidden="true">
          <img className="cinema-layer cinema-layer-a" src={scene.image} alt="" loading={hero ? "eager" : "lazy"}/>
          <img className="cinema-layer cinema-layer-b" src={scene.image} alt="" loading={hero ? "eager" : "lazy"}/>
          <img className="cinema-layer cinema-layer-c" src={scene.image} alt="" loading={hero ? "eager" : "lazy"}/>
        </div>
        <span className="cinema-cursor" aria-hidden="true"><MousePointer2/></span>
        <span className="cinema-click" aria-hidden="true"/>
        <span className="cinema-annotation" aria-hidden="true"><i/> {scene.annotation}</span>
        <span className="cinema-scanline" aria-hidden="true"/>
      </div>
      <div className="cinema-status" aria-hidden="true"><span><scene.icon/>{scene.note}</span><b>SCENE {String(scenes.indexOf(scene) + 1).padStart(2, "0")}</b></div>
    </div>
    <button type="button" className="cinema-replay" onClick={() => setTake(value => value + 1)} aria-label={`Replay ${scene.title} animation`}><Play/><span>Replay</span></button>
  </div>;
}

export function CinematicHeroTeaser() {
  return <CinematicStage scene={scenes[scenes.length - 1]} hero/>;
}

export function CinematicProductStory() {
  return <div className="cinematic-product-story">
    {scenes.slice(0, -1).map((scene, index) => <article className={`cinematic-beat${index % 2 ? " cinematic-beat-reverse" : ""}`} key={scene.id}>
      <div className="cinematic-copy">
        <span className="cinematic-number">0{index + 1}</span>
        <p className="kicker">{scene.eyebrow}</p>
        <h3>{scene.title}</h3>
        <p>{scene.description}</p>
        <ul>{scene.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      </div>
      <CinematicStage scene={scene}/>
    </article>)}
  </div>;
}
