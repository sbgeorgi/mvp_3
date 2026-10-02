import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLang, waLink, type Lang } from "../i18n";
import { Arrow, getLenis, scrollToId, Wordmark } from "./Brand";

const SECTIONS = ["club", "training", "pricing", "adrian", "fuel", "visit"] as const;
export function LangSwitch({ size = "sm" }: { size?: "sm" | "lg" }) {
  const { lang, setLang } = useLang();
  return <div role="group" aria-label={lang === "es" ? "Idioma" : "Language"} className={"language-switch language-" + size}>{(["en", "es"] as Lang[]).map(option => <button key={option} onClick={() => setLang(option)} aria-pressed={lang === option}>{option.toUpperCase()}</button>)}</div>;
}
export default function Header() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const {scrollYProgress} = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
      let current = "";
      for (const id of SECTIONS) if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) < 180) current = id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const desktop = window.matchMedia("(min-width: 1200px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => { window.removeEventListener("scroll", onScroll); desktop.removeEventListener("change", closeOnDesktop); };
  }, []);
  useLayoutEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    const elements = () => Array.from(menu.current?.querySelectorAll<HTMLElement>('button, a[href]') ?? []);
    elements()[0]?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key === "Tab") {
        const controls = elements();
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = previous; getLenis()?.start(); document.removeEventListener("keydown", keydown); };
  }, [open]);
  const go = (id: string) => {
    setOpen(false);
    if (open) toggle.current?.focus();
    requestAnimationFrame(() => scrollToId(id));
  };
  return <>
    <header inert={open ? true : undefined} className={"premium-header " + (scrolled || open ? "header-solid" : "")}>
      <div className="header-shell">
        <button onClick={() => go("top")} aria-label="Adrian's Gym — home" className="brand-home"><Wordmark /></button>
        <nav aria-label={lang === "es" ? "Navegación principal" : "Main navigation"} className="desktop-nav">{SECTIONS.map(id => <button key={id} onClick={() => go(id)} aria-current={active === id ? "location" : undefined}>{t.nav[id]}</button>)}</nav>
        <div className="header-actions"><LangSwitch /><a className="button button-gold header-join" href={waLink(t.wa.general)} target="_blank" rel="noreferrer">{t.nav.cta}<Arrow /></a><button ref={toggle} onClick={() => setOpen(value => !value)} aria-label={open ? (lang === "es" ? "Cerrar menú" : "Close menu") : (lang === "es" ? "Abrir menú" : "Open menu")} aria-expanded={open} aria-controls="mobile-menu" className="menu-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d={open ? "M6 6l12 12M6 18 18 6" : "M5 8h14M5 16h14"} /></svg></button></div>
      </div>
      <motion.span data-scroll-progress="" className="header-progress" style={{scaleX:scrollYProgress}} />
    </header>
    <AnimatePresence>{open && <motion.div ref={menu} id="mobile-menu" role="dialog" aria-modal="true" aria-label={lang === "es" ? "Menú de navegación" : "Navigation menu"} className="mobile-menu" initial={reduced ? false : { clipPath: "circle(0% at 95% 4%)" }} animate={{ clipPath: "circle(150% at 95% 4%)" }} exit={reduced ? {} : { clipPath: "circle(0% at 95% 4%)" }} transition={{ duration: reduced ? 0 : .7, ease: [.76,0,.24,1] }}>
      <div className="mobile-menu-header"><Wordmark /><button data-menu-close="" onClick={() => { setOpen(false); toggle.current?.focus(); }} aria-label={lang === "es" ? "Cerrar menú" : "Close menu"} className="menu-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M6 18 18 6" /></svg></button></div>
      <p className="eyebrow">{t.loader} · WEST END</p>
      <nav aria-label={lang === "es" ? "Navegación móvil" : "Mobile navigation"}>{SECTIONS.map((id, i) => <button key={id} onClick={() => go(id)}><span className="eyebrow">0{i + 1}</span>{t.nav[id]}<Arrow /></button>)}</nav>
      <a href={waLink(t.wa.general)} target="_blank" rel="noreferrer" className="button button-gold">{t.nav.cta}<Arrow /></a>
    </motion.div>}</AnimatePresence>
  </>;
}
