import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FACEBOOK, INSTAGRAM, MAPS, PHONE_DISPLAY, useLang, waLink } from "../i18n";
import { Arrow, Monogram, scrollToId, WhatsAppIcon, Wordmark } from "./Brand";
import { MaskText, Reveal, SectionKicker } from "./motion";
import { GymMap } from "./GymMap";
import { OpeningHoursList, OpeningStatus } from "./OpeningHours";
import { bindReviewsCarousel } from "../reviewsCarousel";

export function Reviews() {
  const { t, lang } = useLang();
  const carousel = useRef<HTMLDivElement>(null);
  useEffect(() => carousel.current ? bindReviewsCarousel(carousel.current) : undefined, [lang]);
  return <section id="reviews" className="premium-reviews section-space" aria-labelledby="reviews-title"><div className="page-shell">
    <div className="section-heading"><div><SectionKicker>{t.reviews.kicker}</SectionKicker><h2 id="reviews-title" className="section-title"><MaskText>{t.reviews.title}.</MaskText></h2></div><div className="review-score"><span>4.8</span><div><span className="rating-stars" aria-hidden="true">★★★★★</span><p className="eyebrow">GOOGLE · 65 {t.hero.reviews}</p></div></div></div>
    <div ref={carousel} className="reviews-carousel">
      <div data-reviews-viewport="" className="reviews-viewport" tabIndex={0} role="region" aria-label={lang === "es" ? "Reseñas de Google" : "Google reviews"} aria-describedby="reviews-instructions">
        <div className="reviews-track">{t.reviews.list.map(review => <article className="review-card" key={review.n}><figure><span className="review-quote" aria-hidden="true">“</span><blockquote>{review.t}</blockquote><figcaption><span>{review.n}</span><span className="eyebrow">{lang === "es" ? "Reseña de Google" : "Google review"}</span></figcaption></figure></article>)}</div>
      </div>
      <div className="reviews-controls"><p id="reviews-instructions" className="eyebrow">{lang === "es" ? "Desliza o arrastra para leer" : "Swipe or drag to read"}</p><span data-review-range="" className="eyebrow">1 / {t.reviews.list.length}</span><button data-review-previous="" disabled aria-label={lang === "es" ? "Reseña anterior" : "Previous review"}><Arrow /></button><button data-review-next="" aria-label={lang === "es" ? "Siguiente reseña" : "Next review"}><Arrow /></button></div>
    </div>
  </div></section>;
}
export function Visit() {
  const { t } = useLang();
  return <section id="visit" className="premium-visit light-section section-space" aria-labelledby="visit-title"><div className="page-shell">
    <div className="section-heading"><div><SectionKicker light>{t.visit.kicker}</SectionKicker><h2 id="visit-title" className="section-title"><MaskText>{t.visit.title}.</MaskText></h2></div><span className="visit-location eyebrow">WEST END / ROATÁN<br />16.3061° N · 86.5899° W</span></div>
    <div className="visit-grid">
      <div className="visit-info"><p className="visit-address">{t.visit.address}</p><p className="eyebrow visit-walk">{t.visit.parking}</p>
        <div className="hours-title"><h3 className="eyebrow">{t.visit.hoursTitle}</h3><OpeningStatus /></div>
        <OpeningHoursList />
        <div className="visit-actions"><a href={MAPS} target="_blank" rel="noreferrer" className="button button-dark">{t.visit.directions}<Arrow /></a><a href={waLink(t.wa.general)} target="_blank" rel="noreferrer" className="text-link"><WhatsAppIcon />{t.visit.whatsapp}</a></div>
      </div>
      <div className="visit-map"><GymMap directionsLabel={t.visit.directions} /></div>
    </div>
  </div></section>;
}
export function FAQ() {
  const { t } = useLang();
  return <section className="premium-faq light-section section-space"><div className="page-shell faq-grid">
    <div><SectionKicker light>{t.faq.kicker}</SectionKicker><h2 className="section-title"><MaskText>{t.faq.title}.</MaskText></h2></div>
    <div className="faq-list">{t.faq.list.map((item, i) => <details key={item.q} open={i === 0}><summary>{item.q}<span className="faq-icon" aria-hidden="true" /></summary><p>{item.a}</p></details>)}</div>
  </div></section>;
}
export function FinalCTA() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const {scrollYProgress} = useScroll({target:ref,offset:["start end","end end"]});
  const scale = useTransform(scrollYProgress,[0,1],[.86,1]);
  const radius = useTransform(scrollYProgress,[0,1],[48,0]);
  const channels = [
    { name: "WhatsApp", detail: PHONE_DISPLAY, href: waLink(t.wa.general), icon: <WhatsAppIcon /> },
    { name: "Instagram", detail: "@adriansgym_roatan", href: INSTAGRAM, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg> },
    { name: "Facebook", detail: "Adriansgym Roatan", href: FACEBOOK, icon: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" /></svg> },
    { name: t.contact.call, detail: PHONE_DISPLAY, href: "tel:+50496079992", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg> },
  ];
  return <motion.section id="contact" aria-labelledby="contact-title" ref={ref} style={reduced ? undefined : {scale,borderRadius:radius}} className="premium-final premium-contact section-space"><div className="page-shell">
    <div className="contact-heading"><div><SectionKicker>{t.contact.kicker}</SectionKicker><h2 id="contact-title" className="section-title"><MaskText>{t.contact.title} <em>{t.contact.title2}</em></MaskText></h2></div><Monogram className="contact-monogram" /></div>
    <div className="contact-grid"><Reveal className="contact-copy"><p className="body-copy">{t.contact.sub}</p><a href={waLink(t.wa.general)} target="_blank" rel="noreferrer" className="button button-gold contact-chat">{t.contact.btn}<Arrow /></a></Reveal>
      <Reveal className="contact-channels">{channels.map(channel => <a key={channel.href} href={channel.href} target={channel.href.startsWith("tel:") ? undefined : "_blank"} rel={channel.href.startsWith("tel:") ? undefined : "noreferrer"}><span className="contact-channel-icon">{channel.icon}</span><span className="contact-channel-copy"><small>{channel.name}</small><strong>{channel.detail}</strong></span><Arrow className="contact-channel-arrow" /></a>)}</Reveal>
    </div>
  </div></motion.section>;
}
export function Footer() {
  const { t } = useLang();
  const links = ["club", "training", "pricing", "adrian", "fuel", "visit"] as const;
  return <footer className="premium-footer"><div className="page-shell">
    <div className="footer-grid"><div><Wordmark /><p className="footer-tag">{t.footer.tag}</p></div>
      <div><h3 className="eyebrow">{t.footer.explore}</h3><ul>{links.map(id => <li key={id}><button onClick={() => scrollToId(id)}>{t.nav[id]}</button></li>)}</ul></div>
      <div><h3 className="eyebrow">{t.footer.contact}</h3><ul><li><button onClick={() => scrollToId("contact")}>{t.contact.title} {t.contact.title2}</button></li><li><a href={waLink(t.wa.general)} target="_blank" rel="noreferrer">WhatsApp · {PHONE_DISPLAY}</a></li><li><a href="tel:+50496079992">Tel · {PHONE_DISPLAY}</a></li><li><p>{t.visit.address}</p></li></ul></div>
      <div><h3 className="eyebrow">{t.footer.follow}</h3><ul><li><a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram<Arrow /></a></li><li><a href={FACEBOOK} target="_blank" rel="noreferrer">Facebook<Arrow /></a></li><li className="footer-hashtag">#HouseOfProgress</li></ul></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Adrian’s Gym. {t.footer.rights}</span><span>WEST END · ROATÁN · HONDURAS</span><button onClick={() => scrollToId("top")}>{t.hero.scroll}<span aria-hidden="true">↑</span></button></div>
  </div></footer>;
}
export function FloatingWhatsApp() {
  const { t } = useLang();
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const action = document.querySelector(".contact-chat");
    if (!action) return;
    const mobile = matchMedia("(max-width:899px)");
    let actionVisible = false;
    const update = () => setHidden(mobile.matches && actionVisible);
    const observer = new IntersectionObserver(([entry]) => { actionVisible = entry.isIntersecting; update(); }, { threshold: 0 });
    observer.observe(action);
    mobile.addEventListener("change", update);
    return () => { observer.disconnect(); mobile.removeEventListener("change", update); };
  }, []);
  return <a hidden={hidden} href={waLink(t.wa.general)} target="_blank" rel="noreferrer" aria-label={t.wa.float} className="floating-contact"><span className="floating-contact-icon"><WhatsAppIcon /></span><span className="floating-contact-label">{t.wa.float}</span></a>;
}
