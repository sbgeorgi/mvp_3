import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import { Photo } from "./Photo";
import { useSceneScroll } from "../useSceneScroll";

export const EASE = [.76, 0, .24, 1] as const;
export const EASE_OUT = [.16, 1, .3, 1] as const;

/** Signature scroll scenes run on every screen, respecting reduced motion. */
export function useCinematic() {
  return !useReducedMotion();
}
export function Reveal({ children, delay = 0, y = 32, className = "", as = "div" }: {
  children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];
  return <Component className={className} initial={reduced ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -24px 0px" }} transition={{ duration: reduced ? 0 : .9, ease: EASE_OUT, delay: reduced ? 0 : delay }}>{children}</Component>;
}
export function MaskText({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number; once?: boolean }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -20px 0px" });
  return <span ref={ref} className={"text-mask " + className}><motion.span initial={reduced ? false : { y: "110%", rotate: 2 }} animate={visible || reduced ? { y: 0, rotate: 0 } : { y: "110%", rotate: 2 }} transition={{ duration: reduced ? 0 : 1.15, ease: EASE_OUT, delay: reduced ? 0 : delay }}>{children}</motion.span></span>;
}
export function ParallaxImage({ src, alt, className = "", amount = 7 }: { src: string; alt: string; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const scrollYProgress = useSceneScroll(ref, "through");
  const y = useTransform(scrollYProgress, [0,1], [-amount, amount]);
  return <div ref={ref} className={"parallax-photo " + className}><motion.div style={reduced ? undefined : { y, scale: 1.06 }}><Photo src={src} alt={alt} /></motion.div></div>;
}
function ScrollWord({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const start = index / total * .8;
  const opacity = useTransform(progress, [start, start + .2], [.18, 1]);
  return <motion.span data-scroll-word={index} style={reduced ? undefined : { opacity }}>{word}{" "}</motion.span>;
}
/** MVP 2's scroll-driven word reveal, preserving one accessible reading order. */
export function ScrollWords({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const words = children.split(/\s+/);
  return <p ref={ref} data-scroll-words="" className={className}><span className="sr-only">{children}</span><span aria-hidden="true">{words.map((word, index) => <ScrollWord key={index} word={word} index={index} total={words.length} progress={scrollYProgress} />)}</span></p>;
}
export function SectionKicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={"section-kicker eyebrow " + (light ? "kicker-light" : "")}><span aria-hidden="true" />{children}</div>;
}
