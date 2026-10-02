import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useLang, waLink } from "../i18n";
import { IMG } from "../media";
import { Arrow, Monogram } from "./Brand";
import { MaskText, Reveal, SectionKicker } from "./motion";
import { Photo } from "./Photo";

export default function Adrian() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const {scrollYProgress} = useScroll({target:ref,offset:["start end","end start"]});
  const imageY = useTransform(scrollYProgress,[0,1],[-28,28]);
  const sealRotation = useTransform(scrollYProgress,[0,1],[-20,35]);
  return (
    <section ref={ref} id="adrian" className="premium-adrian section-space" aria-labelledby="adrian-title">
      <div className="page-shell adrian-grid">
        <Reveal className="adrian-portrait"><figure><motion.div className="adrian-image-layer" style={reduced ? undefined : {y:imageY,scale:1.12}}><Photo src={IMG.adrian} alt={t.adrian.caption} sizes="(min-width: 900px) 34vw, 90vw" position="center 55%" /></motion.div><figcaption><span className="eyebrow">{t.adrian.caption}</span><span className="portrait-signature">Adrian.</span></figcaption></figure><motion.div className="adrian-seal" style={reduced ? undefined : {rotate:sealRotation}} aria-hidden="true"><svg viewBox="0 0 100 100"><defs><path id="adrian-seal-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs><text><textPath href="#adrian-seal-circle">HOUSE OF PROGRESS · ROATÁN · </textPath></text></svg><Monogram className="seal-mark" /></motion.div></Reveal>
        <div className="adrian-story"><SectionKicker>{t.adrian.kicker}</SectionKicker><h2 id="adrian-title" className="section-title"><MaskText>{t.adrian.title}.</MaskText></h2><p className="adrian-lead">{lang === "es" ? "Una pasión por entrenar. Una comunidad que sigue creciendo." : "A passion for training. A community that keeps growing."}</p>
          <div className="adrian-chapters">{t.adrian.chapters.map((chapter, i) => <Reveal key={chapter.y}><span className="eyebrow">0{i + 1} / {chapter.y}</span><h3>{chapter.t}</h3><p>{chapter.d}</p></Reveal>)}</div>
          <a href={waLink(t.wa.pt)} target="_blank" rel="noreferrer" className="button button-gold">{t.adrian.cta}<Arrow /></a>
        </div>
      </div>
    </section>
  );
}
