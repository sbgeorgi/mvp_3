import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import imageMeta from "../image-meta.json";

/** Responsive original photography, with the cinematic image wipes retained. */
export function Photo({ src, alt, className = "", position = "center", priority = false, sizes = "(min-width: 1024px) 40vw, 90vw", style }: {
  src: string; alt: string; className?: string; position?: string; priority?: boolean; sizes?: string; style?: CSSProperties;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(priority);
  useEffect(() => {
    // Observe the frame, because a fully clipped image has no intersection area.
    const frame = ref.current?.parentElement;
    if (!frame || priority || reduced) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {setVisible(true);observer.disconnect();}
    }, {rootMargin:"100px 0px",threshold:.01});
    observer.observe(frame);
    return () => observer.disconnect();
  }, [priority,reduced]);
  const filename = src.split("/").pop() || "";
  const meta = imageMeta[filename as keyof typeof imageMeta];
  const base = src.slice(0, src.lastIndexOf("/") + 1);
  return <motion.img ref={ref}
    src={meta ? base + "optimized/" + meta.file : src}
    srcSet={meta ? meta.variants.map(v => base + "optimized/" + v.file + " " + v.width + "w").join(", ") : undefined}
    sizes={meta ? sizes : undefined} width={meta?.width} height={meta?.height}
    alt={alt} loading={priority ? "eager" : "lazy"}
    fetchPriority={priority ? "high" : "auto"} decoding="async"
    className={"club-photo " + className}
    style={{ objectPosition: position, ...style }}
    initial={reduced ? false : { clipPath: priority ? "inset(0% 100% 0% 0%)" : "inset(100% 0% 0% 0%)", scale: 1.08 }}
    animate={visible || reduced || priority ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 } : undefined}
    transition={{duration:reduced ? 0 : 1.25, ease:[.16,1,.3,1], delay: priority && !reduced ? .15 : 0}}
  />;
}
