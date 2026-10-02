import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react";
import { useRef, useState } from "react";
import { useLang } from "../i18n";

export default function BrandBand() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const position = useMotionValue(0);
  const {scrollY} = useScroll();
  const velocity = useSpring(useVelocity(scrollY),{damping:50,stiffness:400});
  const factor = useTransform(velocity,[0,1000],[0,4],{clamp:false});
  const direction = useRef(1);
  const x = useTransform(position,value=>wrap(-50,0,value)+"%");
  useAnimationFrame((_,delta)=>{
    if (reduced || paused || hovered || document.hidden) return;
    if (factor.get()<0) direction.current=-1; else if (factor.get()>0) direction.current=1;
    const move=direction.current*1.7*(Math.min(delta,50)/1000);
    position.set(position.get()+move+direction.current*move*factor.get());
  });
  return <section className="signature-band" aria-label={t.loader} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
    <motion.div className="band-track" style={reduced ? undefined : {x}}>{[0,1].map(group=><div className="band-group" key={group} aria-hidden={group===1 || undefined}>{t.marquee.map(item=><span key={item}>{item}<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0v20M0 10h20" /></svg></span>)}</div>)}</motion.div>
    {!reduced && <button data-band-toggle="" className="band-pause" aria-pressed={paused} aria-label={paused ? (lang==="es" ? "Reanudar movimiento" : "Resume movement") : (lang==="es" ? "Pausar movimiento" : "Pause movement")} onClick={()=>setPaused(value=>!value)}><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{paused ? <path d="m8 5 11 7-11 7z" /> : <path d="M7 5h3v14H7zm7 0h3v14h-3z" />}</svg></button>}
  </section>;
}
