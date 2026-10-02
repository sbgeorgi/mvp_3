import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MaskText } from "./motion";
import { useLang, waLink } from "../i18n";
import { IMG, VIDEO } from "../media";
import { Arrow, scrollToId } from "./Brand";
import { OpeningStatus } from "./OpeningHours";

export default function Hero() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const manualPause = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const screen = matchMedia("(max-width:899px)");
    const update = () => setMobile(screen.matches);
    update();
    screen.addEventListener("change", update);
    return () => screen.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const node = video.current;
    if (!node) return;
    let visible = false;
    const play = () => {
      if (reduced !== false || manualPause.current || document.hidden || !visible) return;
      if (!node.getAttribute("src")) node.src = VIDEO.hero;
      void node.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play(); else node.pause();
    }, { threshold: .1 });
    observer.observe(node);
    const visibility = () => { if (document.hidden) node.pause(); else play(); };
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); node.pause(); };
  }, [reduced]);
  const toggleVideo = async () => {
    const node = video.current;
    if (!node) return;
    if (!node.paused) { manualPause.current = true; node.pause(); return; }
    manualPause.current = false;
    if (!node.getAttribute("src")) node.src = VIDEO.hero;
    try { await node.play(); } catch { /* Keep the poster and play control if autoplay is unavailable. */ }
  };
  const { scrollYProgress } = useScroll({target:ref,offset:["start start","end start"]});
  const imageY = useTransform(scrollYProgress,[0,1],[0,mobile ? 32 : 100]);
  const imageScale = useTransform(scrollYProgress,[0,1],[1,mobile ? 1.04 : 1.18]);
  const textY = useTransform(scrollYProgress,[0,1],[0,-64]);
  const textOpacity = useTransform(scrollYProgress,[0,.85],[1,0]);
  return (
    <section ref={ref} id="top" className="premium-hero hero-fullscreen" aria-labelledby="hero-title">
      <motion.div className="hero-visual hero-image-layer" style={reduced ? undefined : {y:imageY,scale:imageScale}} aria-hidden="true">
        <video ref={video} data-hero-video="" data-video-src={VIDEO.hero} poster={IMG.hero} muted loop playsInline preload="none" autoPlay={reduced === false} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      </motion.div>
      <div className="hero-photo-shade" />
      <motion.div className="hero-copy" style={reduced ? undefined : {y:textY,opacity:textOpacity}}>
        <p className="eyebrow hero-location"><span />{t.hero.kicker}</p>
        <h1 id="hero-title" className="hero-title"><MaskText delay={.1}>{t.hero.l1}</MaskText><MaskText delay={.24}><em>{t.hero.l2}</em></MaskText></h1>
        <p className="hero-note">{t.hero.l3}</p>
        <p className="hero-description">{t.hero.sub}</p>
        <div className="hero-actions">
          <a href={waLink(t.wa.general)} target="_blank" rel="noreferrer" className="button button-gold">{t.hero.cta1}<Arrow /></a>
          <button onClick={() => scrollToId("club")} className="text-link">{t.hero.cta2}<Arrow /></button>
        </div>
        <div className="hero-proof">
          <span className="hero-rating">4.8<span aria-hidden="true"> / 5</span></span>
          <div><span className="rating-stars" aria-hidden="true">★★★★★</span><span className="eyebrow">{t.hero.rating} · 65 {t.hero.reviews}</span></div>
        </div>
      </motion.div>
      <div className="hero-film-caption"><span className="eyebrow">{t.loader}</span><span>{lang === "es" ? "Tu lugar en la isla." : "Your place on the island."}</span></div>
      <button data-hero-video-toggle="" onClick={toggleVideo} aria-pressed={playing} className="hero-video-toggle"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={playing ? "M7 5h3v14H7zm7 0h3v14h-3z" : "m8 5 11 7-11 7z"} /></svg><span>{playing ? (lang === "es" ? "Pausar video" : "Pause video") : (lang === "es" ? "Reproducir video" : "Play video")}</span></button>
      <div className="hero-baseline"><div className="hero-hours"><OpeningStatus /><button onClick={() => scrollToId("visit")} className="eyebrow">{lang === "es" ? "Ver horario" : "View hours"}<span aria-hidden="true">↓</span></button></div><span className="eyebrow hero-week">{lang === "es" ? "Lun–Dom · 7 días a la semana" : "Mon–Sun · 7 days a week"}</span></div>
    </section>
  );
}
