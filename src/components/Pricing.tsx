import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useLang, waLink } from "../i18n";
import { Arrow } from "./Brand";
import { MaskText, Reveal, SectionKicker } from "./motion";

export default function Pricing() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const {scrollYProgress} = useScroll({target:ref,offset:["start end","start start"]});
  const radius = useTransform(scrollYProgress,[0,1],[64,0]);
  return (
    <motion.section ref={ref} style={reduced ? undefined : {borderTopLeftRadius:radius,borderTopRightRadius:radius}} id="pricing" className="premium-pricing light-section section-space" aria-labelledby="pricing-title">
      <div className="page-shell">
        <div className="section-heading"><div><SectionKicker light>{t.pricing.kicker}</SectionKicker><h2 id="pricing-title" className="section-title"><MaskText>{t.pricing.title}.</MaskText></h2></div><p className="body-copy">{t.pricing.desc}</p></div>
        <div className="pricing-grid">{t.pricing.plans.map((plan, i) => {
          const popular = "popular" in plan && plan.popular;
          return <Reveal as="article" key={plan.id} className={"price-card " + (popular ? "price-card-featured" : "")} delay={i * .05}>
            <div className="price-card-top"><span className="eyebrow">0{i + 1}</span>{popular && <span className="price-badge">{t.pricing.popular}</span>}</div>
            <h3>{plan.name}</h3><p className="price-description">{plan.d}</p>
            <div className={"price-value " + (!plan.per ? "price-value-word" : "")}>{plan.price}<span>{plan.per}</span></div>
            <ul>{plan.f.map(feature => <li key={feature}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>{feature}</li>)}</ul>
            <a href={waLink(plan.id === "pt" ? t.wa.pt : t.wa.plan(plan.name))} target="_blank" rel="noreferrer" className={"button " + (popular ? "button-gold" : "button-outline")}><span>{t.pricing.inquire}</span><Arrow /></a>
          </Reveal>;
        })}</div>
        <a href={waLink(t.wa.group)} target="_blank" rel="noreferrer" className="group-membership"><p>{t.pricing.group}</p><span className="text-link">{t.pricing.groupCta}<Arrow /></span></a>
        <p className="pricing-note">{t.pricing.note}</p>
      </div>
    </motion.section>
  );
}
