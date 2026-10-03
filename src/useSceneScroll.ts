import { useEffect, type RefObject } from "react";
import { useMotionValue } from "motion/react";
import { sceneScrollProgress } from "./scrollGeometry";

/** Native touch scrolling with one update per frame, including viewport and layout changes. */
export function useSceneScroll(
  target: RefObject<HTMLElement | null>,
  mode: "exit" | "through" | "pinned",
  stageSelector = "",
) {
  const progress = useMotionValue(0);
  useEffect(() => {
    const scene = target.current;
    if (!scene) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      progress.set(sceneScrollProgress(scene, mode, stageSelector));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(scene);
    observer.observe(document.body);
    const stage = stageSelector && scene.querySelector(stageSelector);
    if (stage) observer.observe(stage);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
    };
  }, [target, mode, stageSelector, progress]);
  return progress;
}
