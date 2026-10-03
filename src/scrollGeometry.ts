/** Use the rendered sticky stage, not innerHeight (which changes with iOS browser chrome). */
export function pinnedScrollRange(scene: HTMLElement, stageSelector: string) {
  const stage = scene.querySelector<HTMLElement>(stageSelector);
  return Math.max(1, scene.offsetHeight - (stage?.offsetHeight ?? document.documentElement.clientHeight));
}

export function sceneScrollProgress(scene: HTMLElement, mode: "exit" | "through" | "pinned", stageSelector = "") {
  const top = scene.getBoundingClientRect().top;
  const viewport = document.documentElement.clientHeight;
  const progress = mode === "exit" ? -top / Math.max(1, scene.offsetHeight)
    : mode === "pinned" ? -top / pinnedScrollRange(scene, stageSelector)
    : (viewport - top) / Math.max(1, viewport + scene.offsetHeight);
  // Clamp Safari's rubber-band overscroll at both ends of the scene.
  return Math.max(0, Math.min(1, progress));
}
