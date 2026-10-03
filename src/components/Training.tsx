import { motion, useReducedMotion, useTransform } from "motion/react";
import { useSceneScroll } from "../useSceneScroll";
import { useEffect, useRef, useState } from "react";
import { useLang, waLink } from "../i18n";
import { IMG, VIDEO } from "../media";
import { Reveal, SectionKicker, useCinematic } from "./motion";
import { Arrow, scrollToId } from "./Brand";
import { Photo } from "./Photo";

const trainingImages = [IMG.barbell, IMG.coach1, IMG.duo, IMG.island];
export default function Training() {
  const { t, lang } = useLang();
  return (
    <section id="training" className="premium-training light-section section-space" aria-labelledby="training-title">
      <div className="page-shell">
        <div className="section-heading"><div><SectionKicker light>{t.training.kicker}</SectionKicker><h2 id="training-title" className="section-title">{t.training.title}.</h2></div><p className="body-copy">{t.training.desc}</p></div>
        <div className="training-grid">{t.training.items.map((item, i) => <Reveal as="article" key={item.n} className="training-card" delay={i * .05}>
          <a href={waLink(i === 1 ? t.wa.pt : i === 2 ? t.wa.group : i === 3 ? t.wa.plan(t.pricing.plans[0].name) : t.wa.plan(item.t))} target="_blank" rel="noreferrer" className="training-link">
            <div className="training-photo"><Photo src={trainingImages[i]} alt={item.t} position={i === 1 ? "center 60%" : "center 52%"} sizes="(min-width: 1024px) 22vw, (min-width: 600px) 44vw, 90vw" /><span className="photo-number eyebrow">{item.n}</span></div>
            <div className="training-copy"><div className="training-card-title"><h3>{item.t}</h3><span className="circle-arrow"><Arrow /></span></div><p>{item.d}</p><div className="training-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
          </a>
        </Reveal>)}</div><button className="text-link training-film-link" onClick={()=>scrollToId("film")}>{lang==="es" ? "Ver la experiencia" : "Watch the experience"}<Arrow /></button>
      </div>
    </section>
  );
}
/** The original expanding, scroll-linked film scene, with playback control. */
export function FeelIt() {
  const { t, lang } = useLang();
  const cinematic = useCinematic();
  const reduced = useReducedMotion();
  const scene = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const manualPause = useRef(false);
  const [playing, setPlaying] = useState(false);
  const scrollYProgress = useSceneScroll(scene, "pinned", ".film-stage");
  const clip = useTransform(scrollYProgress,value=>{
    const remaining=1-Math.max(0,Math.min(1,value/.42));
    return `inset(${18*remaining}% ${18*remaining}% round ${24*remaining}px)`;
  });
  const scale = useTransform(scrollYProgress,value=>1.15-.15*Math.max(0,Math.min(1,value/.42)));
  const sloganScale = useTransform(scrollYProgress, [0, .42], [.82, 1]);
  const kick = useTransform(scrollYProgress,[0,.16,.3],[1,1,0]);
  const first = useTransform(scrollYProgress,[.28,.4,.58,.68],[0,1,1,.3]);
  const second = useTransform(scrollYProgress,[.43,.55,.73,.84],[0,1,1,.3]);
  const third = useTransform(scrollYProgress,[.59,.72,1],[0,1,1]);
  const y1 = useTransform(scrollYProgress,[.28,.4],[60,0]);
  const y2 = useTransform(scrollYProgress,[.43,.55],[60,0]);
  const y3 = useTransform(scrollYProgress,[.59,.72],[60,0]);
  useEffect(() => {
    const node = video.current;
    if (!node) return;
    let visible = false;
    const play = () => {
      if (reduced || manualPause.current || document.hidden || !visible) return;
      if (!node.getAttribute("src")) node.src = VIDEO.dumbbell;
      void node.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play(); else node.pause();
    },{threshold:.15});
    observer.observe(node);
    const visibility = () => { if (document.hidden) node.pause(); else play(); };
    document.addEventListener("visibilitychange",visibility);
    return () => {observer.disconnect();document.removeEventListener("visibilitychange",visibility);node.pause();};
  },[reduced]);
  const toggle = async () => {
    const node = video.current;
    if (!node) return;
    if (!node.paused) {manualPause.current=true;node.pause();return;}
    manualPause.current=false;
    if (!node.getAttribute("src")) node.src=VIDEO.dumbbell;
    try {await node.play();} catch { /* The controls remain usable if playback is blocked. */ }
  };
  return <section id="film" ref={scene} className="premium-film film-cinematic" aria-labelledby="film-title">
    <div className="film-stage">
      <motion.div className="film-kicker" style={cinematic ? {opacity:kick} : undefined}><SectionKicker>{t.reveal.kicker}</SectionKicker><p>{lang==="es" ? "El ritmo de Adrian’s." : "The rhythm of Adrian’s."}</p></motion.div>
      <motion.div className="film-media" style={cinematic ? {clipPath:clip} : undefined}>
        <motion.video ref={video} data-video-src={VIDEO.dumbbell} style={cinematic ? {scale} : undefined} poster={IMG.barbell} muted loop playsInline preload="none" aria-label={lang==="es" ? "Entrenamiento en Adrian’s Gym" : "Training at Adrian’s Gym"} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} />
        <div className="film-shade" />
      </motion.div>
      <motion.h2 id="film-title" className="film-slogan" style={cinematic ? {scale:sloganScale} : undefined}><motion.span style={cinematic ? {opacity:first,y:y1} : undefined}>{t.reveal.title}</motion.span><motion.span style={cinematic ? {opacity:second,y:y2} : undefined}>{t.reveal.title2}</motion.span><motion.span style={cinematic ? {opacity:third,y:y3} : undefined}>{t.reveal.title3}</motion.span></motion.h2>
      <div className="film-controls page-shell"><button data-video-toggle="" onClick={toggle} aria-pressed={playing} className="film-toggle"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">{playing ? <path d="M7 5h3v14H7zm7 0h3v14h-3z" /> : <path d="m8 5 11 7-11 7z" />}</svg>{playing ? (lang==="es" ? "Pausar video" : "Pause film") : (lang==="es" ? "Reproducir video" : "Play film")}</button><a className="text-link" href="https://www.instagram.com/p/DVMWT4hAWJC/" target="_blank" rel="noreferrer">{t.reveal.reel}<Arrow /></a></div>
    </div>
  </section>;
}
