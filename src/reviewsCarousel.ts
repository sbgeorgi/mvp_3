/** Native touch/trackpad scrolling plus mouse dragging, shared by both builds. */
export function bindReviewsCarousel(root: HTMLElement) {
  const viewport = root.querySelector<HTMLElement>("[data-reviews-viewport]")!;
  const cards = Array.from(root.querySelectorAll<HTMLElement>(".review-card"));
  const previous = root.querySelector<HTMLButtonElement>("[data-review-previous]")!;
  const next = root.querySelector<HTMLButtonElement>("[data-review-next]")!;
  const counter = root.querySelector<HTMLElement>("[data-review-range]")!;
  const reduced = matchMedia("(prefers-reduced-motion:reduce)");
  let pointer: number | null = null, startX = 0, startScroll = 0;
  const maximum = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  const nearest = () => cards.reduce((best, card, index) => Math.abs(card.offsetLeft - viewport.scrollLeft) < Math.abs(cards[best].offsetLeft - viewport.scrollLeft) ? index : best, 0);
  const scrollToCard = (index: number) => viewport.scrollTo({ left: Math.min(maximum(), cards[Math.max(0, Math.min(cards.length - 1, index))].offsetLeft), behavior: reduced.matches ? "instant" : "smooth" });
  const update = () => {
    previous.disabled = viewport.scrollLeft <= 1;
    next.disabled = viewport.scrollLeft >= maximum() - 1;
    const bounds = viewport.getBoundingClientRect();
    const visible = cards.map((card, index) => ({ rect: card.getBoundingClientRect(), index })).filter(({ rect }) => rect.right > bounds.left + 2 && rect.left < bounds.right - 2);
    if (visible.length) {
      const first = visible[0].index + 1, last = visible[visible.length - 1].index + 1;
      counter.textContent = `${first === last ? first : `${first}–${last}`} / ${cards.length}`;
    }
  };
  const back = () => scrollToCard(nearest() - 1);
  const forward = () => scrollToCard(nearest() + 1);
  const key = (event: KeyboardEvent) => {
    if (event.target !== viewport) return;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") back();
    if (event.key === "ArrowRight") forward();
    if (event.key === "Home") scrollToCard(0);
    if (event.key === "End") scrollToCard(cards.length - 1);
  };
  const down = (event: PointerEvent) => {
    // Phones keep the browser's native swipe, momentum and vertical pan.
    if (event.pointerType === "touch" || event.button !== 0) return;
    pointer = event.pointerId;
    startX = event.clientX;
    startScroll = viewport.scrollLeft;
    viewport.classList.add("is-dragging");
    viewport.focus({ preventScroll: true });
    viewport.setPointerCapture(pointer);
    event.preventDefault();
  };
  const move = (event: PointerEvent) => {
    if (pointer !== event.pointerId) return;
    viewport.scrollLeft = startScroll + startX - event.clientX;
    event.preventDefault();
  };
  const finish = (event: PointerEvent) => {
    if (pointer !== event.pointerId) return;
    pointer = null;
    viewport.classList.remove("is-dragging");
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    scrollToCard(nearest());
  };
  viewport.addEventListener("pointerdown", down);
  viewport.addEventListener("pointermove", move);
  viewport.addEventListener("pointerup", finish);
  viewport.addEventListener("pointercancel", finish);
  viewport.addEventListener("lostpointercapture", finish);
  viewport.addEventListener("keydown", key);
  viewport.addEventListener("scroll", update, { passive: true });
  previous.addEventListener("click", back);
  next.addEventListener("click", forward);
  const resize = new ResizeObserver(update);
  resize.observe(viewport);
  update();
  return () => {
    resize.disconnect();
    viewport.classList.remove("is-dragging");
    viewport.removeEventListener("pointerdown", down);
    viewport.removeEventListener("pointermove", move);
    viewport.removeEventListener("pointerup", finish);
    viewport.removeEventListener("pointercancel", finish);
    viewport.removeEventListener("lostpointercapture", finish);
    viewport.removeEventListener("keydown", key);
    viewport.removeEventListener("scroll", update);
    previous.removeEventListener("click", back);
    next.removeEventListener("click", forward);
  };
}
