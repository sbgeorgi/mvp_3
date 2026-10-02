import type Lenis from "lenis";

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (lenis = l);
export const getLenis = () => lenis;

export function scrollToPosition(top: number) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis) lenis.scrollTo(Math.max(0, top), { duration: 1.25, immediate: reduced });
  else window.scrollTo({ top: Math.max(0, top), behavior: reduced ? "instant" : "smooth" });
}

export function scrollToId(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  scrollToPosition(window.scrollY + element.getBoundingClientRect().top - 96);
}

export function Monogram({ className = "h-10 w-10" }: { className?: string }) {
  return <img src={`${import.meta.env.BASE_URL}images/adrians-gym-mark.svg`} alt="" className={className} />;
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Monogram className={compact ? "h-9 w-9" : "h-11 w-11"} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[19px] uppercase tracking-[0.04em] text-bone sm:text-[22px]">
          Adrian's Gym
        </span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.45em] text-gold">Roatán · HN</span>
      </span>
    </span>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.91.99 6.7 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.46-9.47 9.46M20.1 3.9A11.3 11.3 0 0 0 12.05.57C5.77.57.66 5.68.66 11.96c0 2.01.52 3.97 1.52 5.7L.57 23.5l5.98-1.57a11.4 11.4 0 0 0 5.49 1.4h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.34-8.05" />
    </svg>
  );
}

export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
