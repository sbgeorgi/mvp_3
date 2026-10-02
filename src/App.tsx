import BrandBand from "./components/BrandBand";
import Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "./components/Brand";
import { MotionConfig } from "motion/react";
import { LangProvider, useLang } from "./i18n";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Intro, { Club } from "./components/Intro";
import Training, { FeelIt } from "./components/Training";
import Pricing from "./components/Pricing";
import Adrian from "./components/Adrian";
import Fuel from "./components/Fuel";
import { FAQ, FinalCTA, FloatingWhatsApp, Footer, Reviews, Visit } from "./components/Visit";

function Site() {
  const { lang } = useLang();
  useEffect(() => {
    const scroll = new Lenis({ duration: 1.2, easing: value => Math.min(1, 1.001 - Math.pow(2, -10 * value)), autoRaf: true, respectReducedMotion: true, anchors: { offset: -96 }, prevent: node => Boolean(node.closest(".gym-map, .mobile-menu, .reviews-viewport")) });
    setLenis(scroll);
    return () => { scroll.destroy(); setLenis(null); };
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">{lang === "es" ? "Saltar al contenido" : "Skip to content"}</a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero /><Intro /><Club /><Training /><FeelIt /><Pricing /><BrandBand /><Adrian /><Fuel /><Reviews /><Visit /><FAQ /><FinalCTA />
      </main>
      <Footer /><FloatingWhatsApp />
    </MotionConfig>
  );
}
export default function App() { return <LangProvider><Site /></LangProvider>; }
