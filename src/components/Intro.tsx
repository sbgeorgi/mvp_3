import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n";
import { IMG } from "../media";
import { Arrow, Monogram, scrollToId, scrollToPosition } from "./Brand";
import { MaskText, Reveal, ScrollWords, SectionKicker, useCinematic } from "./motion";
import { Photo } from "./Photo";

export default function Intro() {
  const { t, lang } = useLang();
  return (
    <section className="premium-intro light-section section-space">
      <div className="page-shell">
        <Reveal className="intro-grid">
          <div><SectionKicker light>{t.manifesto.kicker}</SectionKicker><Monogram className="intro-monogram" /></div>
          <div><h2 className="intro-statement"><MaskText>{lang === "es" ? "El arte de" : "The art of"}</MaskText><MaskText delay={.12}><em>{lang === "es" ? "sentirte mejor." : "feeling stronger."}</em></MaskText></h2><ScrollWords className="body-copy">{t.manifesto.text}</ScrollWords><button className="text-link" onClick={() => scrollToId("training")}>{t.nav.training}<Arrow /></button></div>
        </Reveal>
        <div className="stats-grid">{t.stats.map((s,i) => <Reveal key={s.l} delay={i*.1}><span className="stat-value">{s.v}</span><span className="eyebrow">{s.l}</span></Reveal>)}</div>
      </div>
    </section>
  );
}
const clubImages = [IMG.rack, IMG.cardio, IMG.variety, IMG.coach1, IMG.poke2];
const clubPositions = ["center 55%", "center 55%", "center 56%", "center 57%", "center 65%"];
export function Club() {
  const { t, lang } = useLang();
  const cinematic = useCinematic();
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target:pin, offset:["start start","end end"] });
  const x = useTransform(scrollYProgress, value => -value*distance);
  const imageDepth = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  useMotionValueEvent(scrollYProgress,"change",value => setIndex(Math.round(value*(t.club.items.length-1))));
  useEffect(() => {
    const measure = () => setDistance(Math.max(0,(track.current?.scrollWidth ?? 0)-(pin.current?.clientWidth ?? 0)));
    const observer = new ResizeObserver(measure);
    if (track.current) observer.observe(track.current);
    if (pin.current) observer.observe(pin.current);
    measure();
    return () => observer.disconnect();
  }, [cinematic, lang]);
  const move = (direction:number) => {
    const element = pin.current;
    if (!element) return;
    const next = Math.max(0,Math.min(t.club.items.length-1,index+direction));
    scrollToPosition(window.scrollY+element.getBoundingClientRect().top + (element.offsetHeight-window.innerHeight)*next/(t.club.items.length-1));
  };
  return (
    <section id="club" className="premium-club section-space" aria-labelledby="club-title">
      <div className="page-shell"><div className="section-heading"><div><SectionKicker>{t.club.kicker}</SectionKicker><h2 id="club-title" className="section-title"><MaskText>{t.club.title}</MaskText><MaskText delay={.12}><em>{t.club.title2}.</em></MaskText></h2></div><p className="body-copy">{t.club.desc}</p></div></div>
      <div ref={pin} className="club-cinematic">
        <div className="club-sticky">
          <motion.div ref={track} className="club-gallery club-track" style={cinematic ? {x} : undefined}>
            {t.club.items.map((item,i) => <article key={item.t} className={"club-card club-card-"+(i+1)}>
              <figure><motion.div className="club-image-depth" style={cinematic ? {scale:imageDepth} : undefined}><Photo src={clubImages[i]} alt={item.t} position={clubPositions[i]} sizes={cinematic ? "(min-width: 900px) 34vw, 82vw" : i === 0 ? "(min-width: 600px) 88vw,90vw" : "(min-width: 600px) 44vw,42vw"} /></motion.div><span className="photo-number eyebrow">0{i+1}</span></figure>
              <div className="club-card-copy"><h3>{item.t}</h3><p>{item.d}</p></div>
            </article>)}
          </motion.div>
          <div className="gallery-controls page-shell"><span className="eyebrow">{t.club.drag}</span><div className="gallery-progress"><motion.span style={{scaleX:scrollYProgress}} /></div><span className="eyebrow">0{index+1} / 05</span><button data-gallery-direction="-1" disabled={index===0} onClick={()=>move(-1)} aria-label={lang==="es" ? "Instalación anterior" : "Previous facility"}><Arrow /></button><button data-gallery-direction="1" disabled={index===4} onClick={()=>move(1)} aria-label={lang==="es" ? "Siguiente instalación" : "Next facility"}><Arrow /></button></div>
        </div>
      </div>
      <div className="page-shell"><div className="amenity-strip"><span className="eyebrow">{lang==="es" ? "Cada detalle cuenta" : "Every detail considered"}</span><p>{lang==="es" ? "Aire acondicionado · Toallas · Lockers · Duchas · Agua purificada · Guardería" : "Air conditioning · Towels · Lockers · Showers · Purified water · Childcare"}</p></div></div>
    </section>
  );
}
