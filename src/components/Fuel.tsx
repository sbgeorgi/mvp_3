import { motion, useTransform, type MotionValue } from "motion/react";
import { useSceneScroll } from "../useSceneScroll";
import { useRef } from "react";
import { useLang, waLink } from "../i18n";
import { IMG } from "../media";
import { Arrow, Monogram } from "./Brand";
import { MaskText, SectionKicker, useCinematic } from "./motion";
import { Photo } from "./Photo";

function FuelCard({index,total,progress,title,description}:{index:number;total:number;progress:MotionValue<number>;title:string;description:string}) {
  const cinematic = useCinematic();
  const scale = useTransform(progress,[index/total,1],[1,1-(total-index)*.045]);
  const imageScale = useTransform(progress,[(index-1)/total,index/total],[1.08,1]);
  return <div className="fuel-stack-stage">
    <motion.article className={"fuel-stack-card fuel-stack-card-"+index} style={cinematic ? {scale,top:index*18} : undefined}>
      <div className="fuel-stack-copy"><span className="eyebrow">0{index+1} / ADRIAN’S GYM</span><h3>{title}</h3><p>{description}</p><Monogram className="fuel-small-mark" /></div>
      <motion.div className="fuel-stack-photo" style={cinematic ? {scale:imageScale} : undefined}>{index===2 ? <Monogram className="fuel-large-mark" /> : <Photo src={index===0 ? IMG.poke2 : IMG.supplements} alt={index===0 ? "Refresh and Refuel juice bar at Adrian's Gym" : "Supplements available at Adrian's Gym"} position={index===0 ? "center 60%" : "center"} sizes="(min-width:900px) 40vw,90vw" />}</motion.div>
    </motion.article>
  </div>;
}
export default function Fuel() {
  const { t } = useLang();
  const stack = useRef<HTMLDivElement>(null);
  const scrollYProgress = useSceneScroll(stack, "pinned", ".fuel-stack-stage");
  return <section id="fuel" className="premium-fuel light-section section-space" aria-labelledby="fuel-title">
    <div className="page-shell"><div className="section-heading"><div><SectionKicker light>{t.fuel.kicker}</SectionKicker><h2 id="fuel-title" className="section-title"><MaskText>{t.fuel.title}.</MaskText><MaskText delay={.12}><em>{t.fuel.title2}</em></MaskText></h2></div><div><p className="body-copy">{t.fuel.desc}</p><a href={waLink(t.wa.fuel)} target="_blank" rel="noreferrer" className="text-link">{t.fuel.cta}<Arrow /></a></div></div></div>
    <div ref={stack} className="fuel-stack page-shell">{t.fuel.cards.map((card,index)=><FuelCard key={card.t} index={index} total={t.fuel.cards.length} progress={scrollYProgress} title={card.t} description={card.d} />)}</div>
  </section>;
}
