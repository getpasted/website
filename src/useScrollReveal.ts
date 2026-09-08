import { useEffect } from "react";

export function useScrollReveal(left: string, right: string, upward: string) {
  useEffect(() => {
    const leftScenes = document.querySelectorAll<HTMLElement>(left);
    const rightScenes = document.querySelectorAll<HTMLElement>(right);
    const upwardScenes = document.querySelectorAll<HTMLElement>(upward);
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
      entries.forEach(entry => {
        if (entry.intersectionRatio >= .2) entry.target.classList.add("is-visible");
        else if (!entry.isIntersecting || entry.intersectionRatio <= .04) entry.target.classList.remove("is-visible");
      });
    }, { threshold: [0, .04, .2], rootMargin: "-12% 0px -12%" });

    scenes.forEach(scene => observer.observe(scene));
    return () => {
      observer.disconnect();
      scenes.forEach(scene => {
        scene.classList.remove("scroll-reveal", "reveal-left", "reveal-right", "reveal-up", "is-visible");
        scene.style.removeProperty("--reveal-delay");
      });
    };
  }, [left, right, upward]);
}
