import { useEffect, useRef, useState } from "react";

export function ClipboardTrail() {
  const [trail, setTrail] = useState<Array<{ id: number; text: string }>>([{ id: 0, text: "You arrived." }]);
  const trailRef = useRef<HTMLElement>(null);
  const trailEntryId = useRef(1);
  useEffect(() => {
    const sections = [
      ["enemy", "The clipboard forgot."], ["clipboard-lab", "Evidence retained."], ["journey", "A plan appeared."],
      ["field-kit", "Toolbelt acquired."], ["privacy", "Business remained yours."], ["cli", "Hatch opened."],
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
    const onCopy = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail && !detail.includes("declined")) setTrail(current => [{ id: trailEntryId.current++, text: detail.replace(/\s+/g, " ").trim() }, ...current].slice(0, 6));
    };
    window.addEventListener("pasted-copy", onCopy);
    return () => window.removeEventListener("pasted-copy", onCopy);
  }, []);
  return (
      <aside ref={trailRef} className="memory-trail" aria-label="Your journey through the page"><strong>CLIPBOARD TRAIL</strong>{trail.map((item, index) => <span key={item.id}><i>0{index + 1}</i><em title={item.text}>{item.text}</em></span>)}</aside>
  );
}
