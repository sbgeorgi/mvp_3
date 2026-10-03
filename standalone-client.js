// Readable HTML companion: native navigation, menu, languages, video, and map.
(() => {
  const site = document.getElementById("site");
  const versions = { en: site.innerHTML, es: document.getElementById("site-es").innerHTML };
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let language = "en";
  let lenis;
  let galleryMove=()=>{};
  let toggleFilm=()=>{};
  let toggleBand=()=>{};
  let toggleHeroVideo=()=>{};
  function scrollToPosition(top) { lenis.scrollTo(Math.max(0,top),{duration:1.25,immediate:motion.matches}); }
  let dispose = () => {};
  const menuToggle = () => site.querySelector("[data-menu-toggle]");
  function setMenu(open, restore = false) {
    const menu = site.querySelector("[data-mobile-menu]");
    if (!menu) return;
    menu.hidden = !open;
    if(open) lenis?.stop(); else lenis?.start();
    menuToggle()?.setAttribute("aria-expanded", String(open));
    site.querySelector("header").inert = open;
    document.body.style.overflow = open ? "hidden" : "";
    if (open) menu.querySelector("button")?.focus();
    else if (restore) menuToggle()?.focus();
  }
  function scrollToSection(id) {
    setMenu(false, true);
    const element = document.getElementById(id);
    if (element) scrollToPosition(scrollY + element.getBoundingClientRect().top - 96);
  }
  function changeLanguage(next) {
    if (!versions[next] || next === language) return;
    const position = scrollY;
    setMenu(false);
    dispose();
    language = next;
    document.documentElement.lang = next;
    try { localStorage.setItem("ag-lang", next); } catch {}
    site.innerHTML = versions[next];
    initializePage();
    lenis.scrollTo(position,{immediate:true});
  }
  site.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.hasAttribute("data-scroll-to")) scrollToSection(button.dataset.scrollTo);
    if (button.hasAttribute("data-language")) changeLanguage(button.dataset.language);
    if (button.hasAttribute("data-menu-toggle")) setMenu(button.getAttribute("aria-expanded") !== "true", true);
    if (button.hasAttribute("data-menu-close")) setMenu(false, true);
    if (button.hasAttribute("data-video-toggle")) toggleFilm();
    if (button.hasAttribute("data-gallery-direction")) galleryMove(Number(button.dataset.galleryDirection));
    if (button.hasAttribute("data-band-toggle")) toggleBand();
    if (button.hasAttribute("data-hero-video-toggle")) toggleHeroVideo();
  });
  document.addEventListener("keydown", event => {
    const menu = site.querySelector("[data-mobile-menu]");
    if (!menu || menu.hidden) return;
    if (event.key === "Escape") setMenu(false, true);
    if (event.key === "Tab") {
      const controls = [...menu.querySelectorAll("button,a[href]")];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  function initializePage() {
    const header = site.querySelector("header");
    lenis = new SiteTools.Lenis({duration:1.2,autoRaf:true,respectReducedMotion:true,anchors:{offset:-96},prevent:node=>Boolean(node.closest(".gym-map,.mobile-menu,.reviews-viewport"))});
    const disposeReviews = SiteTools.bindReviewsCarousel(site.querySelector(".reviews-carousel"));
    function updateHeader() {
      header.classList.toggle("header-solid", scrollY > 32);
      let active = "";
      for (const id of ["club","training","pricing","adrian","fuel","visit"]) {
        if (document.getElementById(id).getBoundingClientRect().top < 180) active = id;
      }
      header.querySelectorAll(".desktop-nav button").forEach(button => {
        if (button.dataset.scrollTo === active) button.setAttribute("aria-current","location");
        else button.removeAttribute("aria-current");
      });
    }
    addEventListener("scroll", updateHeader, { passive:true });
    const desktop = matchMedia("(min-width:1200px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenu(false); };
    desktop.addEventListener("change",closeOnDesktop);
    updateHeader();
    // Small optional reveals, always fully visible for reduced motion.
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); reveals.unobserve(entry.target); }
    }), { threshold: .06 });
    if (!motion.matches) site.querySelectorAll("[data-reveal]").forEach(element => { element.classList.add("site-reveal"); reveals.observe(element); });
    const video = site.querySelector(".film-media video");
    function bindVideo(node, button, isHero = false) {
      let visible = false, manualPause = false;
      node.muted = true;
      const load = () => { if (!node.getAttribute("src")) node.src = node.dataset.videoSrc; };
      const play = () => { if (!motion.matches && visible && !manualPause && !document.hidden) { load(); node.play().catch(() => {}); } };
      const sync = () => {
        const playing = !node.paused;
        button.setAttribute("aria-pressed", String(playing));
        const label = language === "es" ? (playing ? "Pausar video" : "Reproducir video") : (playing ? (isHero ? "Pause video" : "Pause film") : (isHero ? "Play video" : "Play film"));
        button.setAttribute("aria-label", label);
        button.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + (playing ? 'M7 5h3v14H7zm7 0h3v14h-3z' : 'm8 5 11 7-11 7z') + '" /></svg><span>' + label + '</span>';
      };
      node.addEventListener("play", sync); node.addEventListener("pause", sync);
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) play(); else node.pause(); }, { threshold: .1 });
      observer.observe(node);
      const visibility = () => { if (document.hidden || motion.matches) node.pause(); else play(); };
      document.addEventListener("visibilitychange", visibility);
      motion.addEventListener("change", visibility);
      sync();
      return {
        toggle: () => { if (!node.paused) { manualPause = true; node.pause(); } else { manualPause = false; load(); node.play().catch(() => {}); } },
        dispose: () => { observer.disconnect(); node.pause(); node.removeEventListener("play", sync); node.removeEventListener("pause", sync); document.removeEventListener("visibilitychange", visibility); motion.removeEventListener("change", visibility); },
      };
    }
    const filmPlayback = bindVideo(video, site.querySelector("[data-video-toggle]"));
    const heroPlayback = bindVideo(site.querySelector("[data-hero-video]"), site.querySelector("[data-hero-video-toggle]"), true);
    toggleFilm = filmPlayback.toggle;
    toggleHeroVideo = heroPlayback.toggle;
    const clamp=v=>Math.max(0,Math.min(1,v));
    const range=(v,a,b)=>clamp((v-a)/(b-a));
    const progress=(el,stage)=>SiteTools.sceneScrollProgress(el,'pinned',stage);
    const gallery=site.querySelector('.club-cinematic'),track=site.querySelector('.club-track');
    const film=site.querySelector('.film-cinematic'),filmMedia=site.querySelector('.film-media');
    const stack=site.querySelector('.fuel-stack'),stackCards=[...site.querySelectorAll('.fuel-stack-card')];
    const hero=site.querySelector('.premium-hero'),heroImage=site.querySelector('.hero-image-layer'),heroCopy=site.querySelector('.hero-copy');
    const band=site.querySelector('.band-track'),bandSection=site.querySelector('.signature-band'),bandButton=site.querySelector('[data-band-toggle]');
    let bandPaused=false, bandHover=false, bandPosition=0,lastTime=performance.now(),lastY=scrollY,smoothedVelocity=0,frame;
    bandSection.addEventListener('mouseenter',()=>bandHover=true);bandSection.addEventListener('mouseleave',()=>bandHover=false);
    toggleBand=()=>{bandPaused=!bandPaused;bandButton.setAttribute('aria-pressed',String(bandPaused));bandButton.setAttribute('aria-label',language==='es'?(bandPaused?'Reanudar movimiento':'Pausar movimiento'):(bandPaused?'Resume movement':'Pause movement'));bandButton.querySelector('path').setAttribute('d',bandPaused?'m8 5 11 7-11 7z':'M7 5h3v14H7zm7 0h3v14h-3z');};
    let galleryIndex=0;
    galleryMove=direction=>scrollToPosition(scrollY+gallery.getBoundingClientRect().top+SiteTools.pinnedScrollRange(gallery,'.club-sticky')*clamp((galleryIndex+direction)/4));
    function animate(now){
      const dt=Math.min(50,now-lastTime);lastTime=now;
      const dy=scrollY-lastY;lastY=scrollY;smoothedVelocity=smoothedVelocity*.85+dy*.15;
      const cinematic=!motion.matches;
      header.querySelector('[data-scroll-progress]').style.transform='scaleX('+clamp(scrollY/(document.documentElement.scrollHeight-innerHeight))+')';
      if(cinematic){
        const g=progress(gallery,'.club-sticky');track.style.transform='translate3d('+(-g*Math.max(0,track.scrollWidth-gallery.clientWidth))+'px,0,0)';
        galleryIndex=Math.round(g*4);const controls=site.querySelector('.gallery-controls'); controls.querySelector('.gallery-progress span').style.transform='scaleX('+g+')';controls.querySelectorAll('.eyebrow')[1].textContent='0'+(galleryIndex+1)+' / 05';controls.querySelector('[data-gallery-direction="-1"]').disabled=galleryIndex===0;controls.querySelector('[data-gallery-direction="1"]').disabled=galleryIndex===4;
        site.querySelectorAll('.club-image-depth').forEach(image=>image.style.transform='scale('+(1.18-.18*g)+')');
        const f=progress(film,'.film-stage'),expand=range(f,0,.42);filmMedia.style.clipPath='inset('+(18*(1-expand))+'% '+(18*(1-expand))+'% round '+(24*(1-expand))+'px)';video.style.transform='scale('+(1.15-.15*expand)+')';site.querySelector('.film-kicker').style.opacity=1-range(f,.16,.3);site.querySelector('.film-slogan').style.transform='scale('+(.82+.18*expand)+')';
        site.querySelectorAll('.film-slogan span').forEach((span,i)=>{const a=[.28,.43,.59][i],b=[.4,.55,.72][i],c=[.58,.73,1][i],d=[.68,.84,1.1][i];span.style.opacity=range(f,a,b)*(1-.7*range(f,c,d));span.style.transform='translateY('+(60*(1-range(f,a,b)))+'px)';});
      }else{track.style.transform='';site.querySelectorAll('.club-image-depth').forEach(image=>image.style.transform='');filmMedia.style.clipPath='';video.style.transform='';site.querySelector('.film-kicker').style.opacity='';site.querySelector('.film-slogan').style.transform='';site.querySelectorAll('.film-slogan span').forEach(span=>{span.style.opacity='';span.style.transform='';});}
      if(!motion.matches){const p=progress(stack,'.fuel-stack-stage');stackCards.forEach((card,i)=>{card.style.top=i*18+'px';card.style.transform='scale('+(1-(3-i)*.045*range(p,i/3,1))+')';});}else stackCards.forEach(card=>{card.style.top='';card.style.transform='';});
      if(!motion.matches){
        const h=SiteTools.sceneScrollProgress(hero,'exit'),phone=innerWidth<=899;heroImage.style.transform='translate3d(0,'+((phone?32:100)*h)+'px,0) scale('+(1+(phone?0:.18)*h)+')';heroCopy.style.transform='translate3d(0,'+(-64*h)+'px,0)';heroCopy.style.opacity=1-range(h,0,.85);
        site.querySelectorAll('[data-scroll-words]').forEach(paragraph=>{const rect=paragraph.getBoundingClientRect(),p=clamp((innerHeight*.85-rect.top)/(rect.height+innerHeight*.3)),words=[...paragraph.querySelectorAll('[data-scroll-word]')];words.forEach((word,index)=>{const start=index/words.length*.8;word.style.opacity=.18+.82*range(p,start,start+.2);});});
        const pricing=site.querySelector('.premium-pricing'),p=clamp((innerHeight-pricing.getBoundingClientRect().top)/innerHeight);pricing.style.borderTopLeftRadius=pricing.style.borderTopRightRadius=(64*(1-p))+'px';
        const final=site.querySelector('.premium-final'),c=clamp((innerHeight-final.getBoundingClientRect().top)/innerHeight);final.style.transform='scale('+(.86+.14*c)+')';final.style.borderTopLeftRadius=final.style.borderTopRightRadius=(48*(1-c))+'px';
        const portrait=site.querySelector('.adrian-image-layer'),adrian=site.querySelector('.premium-adrian'),a=SiteTools.sceneScrollProgress(adrian,'through');portrait.style.transform='translate3d(0,'+(-28+56*a)+'px,0) scale(1.12)';site.querySelector('.adrian-seal').style.transform='rotate('+(-20+55*a)+'deg)';
        if(!bandPaused&&!bandHover&&!document.hidden){const width=band.scrollWidth/2;bandPosition=(bandPosition-dt*.055*(1+Math.min(4,Math.abs(smoothedVelocity)/20)))%Math.max(1,width);band.style.transform='translateX('+bandPosition+'px)';}
      }else{heroImage.style.transform='';heroCopy.style.transform='';heroCopy.style.opacity='';site.querySelector('.adrian-image-layer').style.transform='';site.querySelector('.adrian-seal').style.transform='';band.style.transform='';}
      frame=requestAnimationFrame(animate);
    }
    frame=requestAnimationFrame(animate);
    // Lazy map: no map tile requests until the visit section approaches.
    const mapElement = site.querySelector(".gym-map-canvas");
    let map;
    const mapObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || map) return;
      const L = SiteTools.Leaflet;
      map = L.map(mapElement, { scrollWheelZoom:false, zoomControl:false }).setView([16.3060784,-86.5898649],16);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>' }).addTo(map);
      L.control.zoom({position:"bottomleft"}).addTo(map);
      L.marker([16.3060784,-86.5898649], { title:"Adrian's Gym Roatán", icon:L.divIcon({
        className:"gym-map-pin", html:'<img src="mvp_3/public/images/adrians-gym-mark.svg" alt="" width="48" height="48">',
        iconSize:[48,48],iconAnchor:[24,24],tooltipAnchor:[0,-28]
      }) }).addTo(map).bindTooltip("Adrian's Gym",{permanent:true,direction:"top",className:"gym-map-label"});
      mapObserver.disconnect();
    }, {rootMargin:"200px"});
    mapObserver.observe(mapElement);
    const resize = new ResizeObserver(() => map?.invalidateSize({pan:false}));
    resize.observe(mapElement);
    function updateHours() {
      const state = SiteTools.getHoursState();
      site.querySelectorAll("[data-hours-status]").forEach(status => {
        status.classList.toggle("status-open", state.open);
        status.querySelector("[data-hours-label]").textContent = SiteTools.formatHoursStatus(state, language);
      });
      site.querySelectorAll("[data-hours-row]").forEach(row => {
        const index = Number(row.dataset.hoursRow);
        const today = index === 0 ? state.day >= 1 && state.day <= 5 : state.day === (index === 1 ? 6 : 0);
        row.classList.toggle("hours-today", today);
        row.querySelector("[data-hours-today]").hidden = !today;
      });
    }
    updateHours();
    const hoursTimer = setInterval(updateHours,60000);
    const mobileContact = matchMedia("(max-width:899px)");
    let contactVisible = false;
    const updateFloating = () => { site.querySelector(".floating-contact").hidden = mobileContact.matches && contactVisible; };
    const contactObserver = new IntersectionObserver(([entry]) => { contactVisible = entry.isIntersecting; updateFloating(); });
    contactObserver.observe(site.querySelector(".contact-chat"));
    mobileContact.addEventListener("change", updateFloating);
    dispose = () => {
      disposeReviews();
      filmPlayback.dispose(); heroPlayback.dispose(); lenis.destroy();cancelAnimationFrame(frame);clearInterval(hoursTimer); reveals.disconnect();
      mapObserver.disconnect(); resize.disconnect(); map?.remove();
      contactObserver.disconnect(); mobileContact.removeEventListener("change", updateFloating);
      removeEventListener("scroll",updateHeader); desktop.removeEventListener("change",closeOnDesktop);
    };
  }
  initializePage();
  let saved;
  try { saved=localStorage.getItem("ag-lang"); } catch {}
  if (saved==="es" || (!saved && navigator.language.toLowerCase().startsWith("es"))) changeLanguage("es");
})();
