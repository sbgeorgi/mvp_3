import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "es";

export const WHATSAPP = "50496079992";
export const PHONE_DISPLAY = "+504 9607-9992";
export const INSTAGRAM = "https://www.instagram.com/adriansgym_roatan/";
export const FACEBOOK = "https://www.facebook.com/mixmax.cardio/";
export const MAPS =
  "https://www.google.com/maps/dir/?api=1&destination=16.3060784,-86.5898649&destination_place_id=ChIJkYvSbqXCaY8RDhH2UJ2kfKo";

export const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

const en = {
  nav: {
    club: "The Club",
    training: "Training",
    pricing: "Memberships",
    adrian: "Adrian",
    fuel: "Fuel Bar",
    visit: "Visit",
    cta: "Join the Club",
  },
  loader: "House of Progress",
  hero: {
    kicker: "West End · Roatán · Honduras",
    l1: "A higher",
    l2: "standard.",
    l3: "An island state of mind.",
    sub: "An elevated training experience in the heart of West End. Expert coaching, complete facilities, and the freedom to feel your best.",
    cta1: "Experience Adrian’s",
    cta2: "Explore the Club",
    scroll: "Scroll",
    rating: "Google rating",
    reviews: "reviews",
  },
  marquee: ["Train Hard", "Stay Island", "House of Progress", "No Excuses", "Classic Iron", "West End Roatán"],
  manifesto: {
    kicker: "This is Adrian's",
    text: "A considered space for your daily ritual. Train with purpose, find your community, and make time for yourself. From island residents to passing travelers, everyone has a place at Adrian’s.",
  },
  stats: [
    { v: "4.8★", l: "Google rating" },
    { v: "3", l: "Power squat racks" },
    { v: "100%", l: "Air-conditioned" },
    { v: "7", l: "Days a week" },
  ],
  club: {
    kicker: "Inside the club",
    title: "The House",
    title2: "of Progress",
    desc: "A complete weights and cardio floor, with towels, secure lockers, hot and cold showers, purified water and childcare. Come train, then refuel at the juice bar.",
    drag: "Scroll to explore",
    items: [
      { t: "Power Zone", d: "3 squat racks + Smith machine, Olympic bars and bumper plates." },
      { t: "Cardio Deck", d: "Treadmills, bikes and conditioning — all under cold A/C." },
      { t: "Strength Floor", d: "A complete machine and free-weight floor, designed around your training." },
      { t: "Coaching Corner", d: "One-on-one sessions with Adrian and the team." },
      { t: "Juice Bar", d: "Protein shakes, juices and a wide selection of supplements." },
    ],
  },
  reveal: {
    kicker: "Feel it",
    title: "Heavy iron.",
    title2: "Cold air.",
    title3: "Island heat.",
    reel: "Watch the full reel",
  },
  training: {
    kicker: "Training",
    title: "Ways to train",
    desc: "Whether you're on the island for a week or for life, there's a way in for you.",
    items: [
      {
        n: "01",
        t: "Open Gym",
        d: "Full access to the power zone, dumbbells, machines and cardio deck during all opening hours. Train your program, your way.",
        tags: ["All levels", "Self-guided"],
      },
      {
        n: "02",
        t: "Personal Training",
        d: "One-on-one coaching with Adrian. Technique, programming, nutrition guidance and the push you need for that last rep.",
        tags: ["1:1", "Custom plan"],
      },
      {
        n: "03",
        t: "Group Plans",
        d: "Form a group of four friends or family members and save 20% compared with individual memberships. More motivation, more support, fewer excuses.",
        tags: ["4 people", "20% off"],
      },
      {
        n: "04",
        t: "Travelers & Divers",
        d: "On vacation or a cruise day? Keep your streak alive with day and week passes — steps from West End.",
        tags: ["Day pass", "Week pass"],
      },
    ],
  },
  pricing: {
    kicker: "Memberships",
    title: "Make it your ritual",
    desc: "A day, a week, or a place in your everyday life. Find the membership that fits your time on the island.",
    popular: "Most popular",
    inquire: "Inquire on WhatsApp",
    note: "Rates shown in USD — lempiras welcome. Prices subject to change; confirm current rates via WhatsApp.",
    plans: [
      {
        id: "day",
        name: "Day Pass",
        price: "$10",
        per: "/ day",
        d: "Drop in for a full session.",
        f: ["Full gym access", "Weights and cardio", "Showers and purified water"],
      },
      {
        id: "week",
        name: "Week Pass",
        price: "$30",
        per: "/ week",
        d: "Perfect for island vacations.",
        f: ["7 days unlimited", "All equipment", "Secure lockers", "Juice bar on site"],
        popular: true,
      },
      {
        id: "month",
        name: "Membership",
        price: "$50",
        per: "/ month",
        d: "For locals & long-stay expats.",
        f: ["Unlimited monthly access", "Towels and lockers", "Showers and purified water", "Childcare available"],
      },
      {
        id: "pt",
        name: "Personal Training",
        price: "Ask",
        per: "",
        d: "1:1 coaching with Adrian.",
        f: ["Custom program", "Technique coaching", "Nutrition guidance", "Session packs"],
      },
    ],
    group: "Four friends or family members. 20% off individual memberships.",
    groupCta: "Ask about the group plan",
  },
  adrian: {
    kicker: "A personal approach",
    title: "Meet Adrian",
    quote: "“Progress isn't a place you arrive. It's a house you build — one rep at a time.”",
    chapters: [
      {
        y: "The Spark",
        t: "Iron as a way of life",
        d: "Inspired by the golden era of bodybuilding, Adrian found in the weight room what he'd been looking for: discipline, confidence and a community that pushes you forward.",
      },
      {
        y: "The Grind",
        t: "Coaching the island",
        d: "Years of training locals, expats and travelers taught him that everyone's journey is different — but the work is always the same. Show up. Lift. Repeat.",
      },
      {
        y: "The House",
        t: "Adrian's Gym is born",
        d: "He opened his doors on the main road in West End with one mission: give Roatán a serious gym with real heart. #HouseOfProgress became the rallying cry.",
      },
      {
        y: "Today",
        t: "Remodeled. Reloaded.",
        d: "A complete gym with weights, cardio, showers, lockers, childcare, a juice bar and supplements — built for a community that keeps showing up.",
      },
    ],
    cta: "Train with Adrian",
    caption: "Adrian — Founder & Head Coach",
  },
  fuel: {
    kicker: "Fuel Bar",
    title: "Refuel",
    title2: "with intention.",
    desc: "Stop by the juice bar for a protein shake, smoothie or refreshing juice. Explore a wide range of supplements and get help choosing what fits your routine.",
    cards: [
      { t: "Juice Bar", d: "Protein shakes, smoothies and refreshing juices for your post-workout stop." },
            { t: "Supplements", d: "A wide range of products for your training goals." },
      { t: "Apparel", d: "AdriansGym apparel. Ask about available styles and sizes." },
    ],
    cta: "Ask about the menu",
  },
  reviews: {
    kicker: "Word on the island",
    title: "What members say",
    list: [
      { n: "Jordan B.", t: "Awesome gym conveniently located in West End. The music is always on point and helps get that last rep. Adrian is an excellent personal trainer and his energy and knowledge is infectious." },
      { n: "Ryan Y.", t: "Totally remodeled and now featuring air conditioning! 3 squat racks and 1 smith! 30 bucks for a week, walkable from West End." },
      { n: "David H.", t: "Wonderful gym. Just a quick walk outside of West End. I worked out here almost every day while I was here. Great value, has all the equipment you need." },
      { n: "Serena B.", t: "Great gym with poke bar, smoothies and personal training." },
      { n: "Jeniffer A.", t: "Every day they complement their gym with new design and more stuff. Thumbs up!" },
    ],
  },
  visit: {
    kicker: "Visit us",
    title: "Find the House",
    address: "Main Road, across from the Petrosun gas station, West End, Roatán, Islas de la Bahía 34101, Honduras",
    hoursTitle: "Opening hours",
    hours: [
      { d: "Monday – Friday", h: "5:30 AM – 9:00 PM" },
      { d: "Saturday", h: "6:30 AM – 2:00 PM" },
      { d: "Sunday", h: "7:30 AM – 12:00 PM" },
    ],
    directions: "Get directions",
    whatsapp: "Message on WhatsApp",
    parking: "Walkable from West End",
  },
  faq: {
    kicker: "FAQ",
    title: "Questions",
    list: [
      { q: "I'm visiting Roatán — can I train for just a day or a week?", a: "Absolutely. We offer day passes and week passes made for travelers, divers and cruise visitors. Just walk in or message us on WhatsApp." },
      { q: "Is the gym air-conditioned?", a: "Yes. The gym was totally remodeled and the training floor is fully air-conditioned — a game changer in the Caribbean heat." },
      { q: "What equipment do you have?", a: "Three squat racks, a Smith machine, free weights, machines and cardio equipment." },
      { q: "Do you offer personal training?", a: "Yes — Adrian and the team offer one-on-one sessions for every level, from total beginners to competitive lifters." },
      { q: "What amenities are available?", a: "Towels, secure lockers, hot and cold showers, purified water, childcare and a complete weights and cardio floor. The juice bar offers shakes and other refreshing options." },
      { q: "Where exactly are you located?", a: "On the main road in West End, across from the Petrosun gas station — a short walk from the West End strip." },
    ],
  },
  contact: {
    kicker: "Contact",
    title: "Let’s",
    title2: "train.",
    sub: "The fastest way to reach us is WhatsApp. Ask about passes, personal training or just say hi — or find us on Instagram and Facebook.",
    btn: "Chat on WhatsApp",
    call: "Call",
  },
  cta: {
    title: "Your progress",
    title2: "starts today.",
    sub: "Find your rhythm. Make yourself at home.",
    btn: "Start on WhatsApp",
  },
  footer: {
    tag: "Roatán's House of Progress.",
    rights: "All rights reserved.",
    follow: "Follow",
    contact: "Contact",
    explore: "Explore",
  },
  wa: {
    general: "Hi Adrian's Gym! I'd like more information about training with you.",
    plan: (p: string) => `Hi Adrian's Gym! I'm interested in the ${p}. Can you share more details?`,
    pt: "Hi Adrian! I'm interested in personal training. Can we talk about a plan?",
    group: "Hi Adrian's Gym! We're four people interested in the group membership and 20% discount. Can you share the details?",
    fuel: "Hi Adrian's Gym! Could you share the juice bar menu and supplements available?",
    float: "Chat on WhatsApp",
  },
};

export type Dict = typeof en;

const es: Dict = {
  nav: {
    club: "El Club",
    training: "Entrenamiento",
    pricing: "Membresías",
    adrian: "Adrian",
    fuel: "Fuel Bar",
    visit: "Visítanos",
    cta: "Únete",
  },
  loader: "Casa del Progreso",
  hero: {
    kicker: "West End · Roatán · Honduras",
    l1: "Un nuevo",
    l2: "estándar.",
    l3: "El espíritu de la isla.",
    sub: "Una experiencia de entrenamiento excepcional en el corazón de West End. Coaching personal, instalaciones completas y espacio para sentirte mejor.",
    cta1: "Descubre Adrian’s",
    cta2: "Conoce el Club",
    scroll: "Desliza",
    rating: "Calificación Google",
    reviews: "reseñas",
  },
  marquee: ["Entrena Duro", "Vive la Isla", "Casa del Progreso", "Sin Excusas", "Hierro Clásico", "West End Roatán"],
  manifesto: {
    kicker: "Esto es Adrian's",
    text: "Un espacio pensado para tu ritual diario. Entrena con intención, encuentra tu comunidad y dedica tiempo a ti. Residentes de la isla y viajeros: todos tienen un lugar en Adrian’s.",
  },
  stats: [
    { v: "4.8★", l: "Calificación Google" },
    { v: "3", l: "Racks de sentadilla" },
    { v: "100%", l: "Aire acondicionado" },
    { v: "7", l: "Días a la semana" },
  ],
  club: {
    kicker: "Dentro del club",
    title: "La Casa",
    title2: "del Progreso",
    desc: "Zona completa de pesas y cardio, con toallas, lockers seguros, duchas con agua fría y caliente, agua purificada y guardería infantil. Entrena y recarga en el juice bar.",
    drag: "Desliza para explorar",
    items: [
      { t: "Zona de Poder", d: "3 racks de sentadilla + máquina Smith, barras olímpicas y discos." },
      { t: "Zona Cardio", d: "Caminadoras, bicicletas y acondicionamiento — todo con A/C." },
      { t: "Zona de Fuerza", d: "Una zona completa de máquinas y pesas libres para tu entrenamiento." },
      { t: "Rincón del Coach", d: "Sesiones uno a uno con Adrian y el equipo." },
      { t: "Juice Bar", d: "Batidos de proteína, jugos y amplia gama de suplementos." },
    ],
  },
  reveal: {
    kicker: "Siéntelo",
    title: "Hierro pesado.",
    title2: "Aire frío.",
    title3: "Calor de isla.",
    reel: "Ver el reel completo",
  },
  training: {
    kicker: "Entrenamiento",
    title: "Formas de entrenar",
    desc: "Ya sea que estés en la isla por una semana o para toda la vida, hay una opción para ti.",
    items: [
      {
        n: "01",
        t: "Gimnasio Libre",
        d: "Acceso completo a la zona de poder, mancuernas, máquinas y cardio en todo el horario. Entrena tu programa, a tu manera.",
        tags: ["Todo nivel", "Autoguiado"],
      },
      {
        n: "02",
        t: "Entrenamiento Personal",
        d: "Coaching uno a uno con Adrian. Técnica, programación, guía nutricional y el empuje que necesitas para esa última repetición.",
        tags: ["1:1", "Plan a medida"],
      },
      {
        n: "03",
        t: "Planes Grupales",
        d: "Forma un grupo de cuatro amigos o familiares y ahorren 20% frente al precio de las membresías individuales. Más motivación, más apoyo, menos pretextos.",
        tags: ["4 personas", "20% menos"],
      },
      {
        n: "04",
        t: "Viajeros y Buzos",
        d: "¿De vacaciones o en día de crucero? Mantén tu racha con pases por día y por semana — a pasos de West End.",
        tags: ["Pase diario", "Pase semanal"],
      },
    ],
  },
  pricing: {
    kicker: "Membresías",
    title: "Tu ritual empieza aquí",
    desc: "Un día, una semana o parte de tu vida diaria. Encuentra la membresía ideal para tu tiempo en la isla.",
    popular: "Más popular",
    inquire: "Consultar por WhatsApp",
    note: "Precios en USD — se aceptan lempiras. Precios sujetos a cambio; confirma las tarifas actuales por WhatsApp.",
    plans: [
      {
        id: "day",
        name: "Pase del Día",
        price: "$10",
        per: "/ día",
        d: "Entra por una sesión completa.",
        f: ["Acceso total al gym", "Pesas y cardio", "Duchas y agua purificada"],
      },
      {
        id: "week",
        name: "Pase Semanal",
        price: "$30",
        per: "/ semana",
        d: "Perfecto para vacaciones en la isla.",
        f: ["7 días ilimitados", "Todo el equipo", "Lockers seguros", "Juice bar en el local"],
        popular: true,
      },
      {
        id: "month",
        name: "Membresía",
        price: "$50",
        per: "/ mes",
        d: "Para locales y expatriados.",
        f: ["Acceso mensual ilimitado", "Toallas y lockers", "Duchas y agua purificada", "Guardería infantil"],
      },
      {
        id: "pt",
        name: "Entrenamiento Personal",
        price: "Consulta",
        per: "",
        d: "Coaching 1:1 con Adrian.",
        f: ["Programa a medida", "Coaching de técnica", "Guía nutricional", "Paquetes de sesiones"],
      },
    ],
    group: "Cuatro amigos o familiares. 20% menos que las membresías individuales.",
    groupCta: "Pregunta por el plan grupal",
  },
  adrian: {
    kicker: "Un enfoque personal",
    title: "Conoce a Adrian",
    quote: "“El progreso no es un lugar al que llegas. Es una casa que construyes — una repetición a la vez.”",
    chapters: [
      {
        y: "La Chispa",
        t: "El hierro como estilo de vida",
        d: "Inspirado por la era dorada del fisicoculturismo, Adrian encontró en el gimnasio lo que buscaba: disciplina, confianza y una comunidad que te impulsa.",
      },
      {
        y: "La Lucha",
        t: "Entrenando a la isla",
        d: "Años entrenando a locales, expatriados y viajeros le enseñaron que cada camino es distinto — pero el trabajo siempre es el mismo. Llega. Levanta. Repite.",
      },
      {
        y: "La Casa",
        t: "Nace Adrian's Gym",
        d: "Abrió sus puertas en la calle principal de West End con una misión: darle a Roatán un gimnasio serio y con corazón. #HouseOfProgress se volvió el grito de guerra.",
      },
      {
        y: "Hoy",
        t: "Remodelado. Recargado.",
        d: "Un gimnasio completo con pesas, cardio, duchas, lockers, guardería infantil, juice bar y suplementos — creado para una comunidad que no deja de entrenar.",
      },
    ],
    cta: "Entrena con Adrian",
    caption: "Adrian — Fundador y Coach Principal",
  },
  fuel: {
    kicker: "Fuel Bar",
    title: "Recarga",
    title2: "con intención.",
    desc: "Pasa por el juice bar para un batido de proteína, smoothie o jugo refrescante. Explora una amplia gama de suplementos y encuentra opciones para tu rutina.",
    cards: [
      { t: "Juice Bar", d: "Batidos de proteína, smoothies y jugos refrescantes para después del entrenamiento." },
            { t: "Suplementos", d: "Amplia gama de productos para tus metas de entrenamiento." },
      { t: "Ropa", d: "Ropa AdriansGym. Pregunta por los estilos y tallas disponibles." },
    ],
    cta: "Pregunta por el menú",
  },
  reviews: {
    kicker: "Lo que dice la isla",
    title: "Opiniones de miembros",
    list: [
      { n: "Jordan B.", t: "Gimnasio increíble, muy bien ubicado en West End. La música siempre está perfecta y ayuda con esa última repetición. Adrian es un excelente entrenador y su energía y conocimiento son contagiosos." },
      { n: "Ryan Y.", t: "¡Totalmente remodelado y ahora con aire acondicionado! 3 racks de sentadilla y 1 Smith. 30 dólares la semana, a pie desde West End." },
      { n: "David H.", t: "Gimnasio maravilloso. A una corta caminata de West End. Entrené aquí casi todos los días durante mi estadía. Excelente valor, tiene todo el equipo que necesitas." },
      { n: "Serena B.", t: "Gran gimnasio con bar de poke, smoothies y entrenamiento personal." },
      { n: "Jeniffer A.", t: "Cada día complementan el gimnasio con nuevo diseño y más cosas. ¡Excelente!" },
    ],
  },
  visit: {
    kicker: "Visítanos",
    title: "Encuentra la Casa",
    address: "Calle principal, frente a la gasolinera Petrosun, West End, Roatán, Islas de la Bahía 34101, Honduras",
    hoursTitle: "Horario",
    hours: [
      { d: "Lunes – Viernes", h: "5:30 AM – 9:00 PM" },
      { d: "Sábado", h: "6:30 AM – 2:00 PM" },
      { d: "Domingo", h: "7:30 AM – 12:00 PM" },
    ],
    directions: "Cómo llegar",
    whatsapp: "Escríbenos por WhatsApp",
    parking: "A pie desde West End",
  },
  faq: {
    kicker: "Preguntas",
    title: "Dudas",
    list: [
      { q: "Estoy de visita en Roatán — ¿puedo entrenar solo un día o una semana?", a: "¡Claro! Ofrecemos pases diarios y semanales pensados para viajeros, buzos y visitantes de cruceros. Solo llega o escríbenos por WhatsApp." },
      { q: "¿El gimnasio tiene aire acondicionado?", a: "Sí. El gimnasio fue totalmente remodelado y el piso de entrenamiento tiene aire acondicionado — un cambio total con el calor del Caribe." },
      { q: "¿Qué equipo tienen?", a: "Tres racks de sentadilla, máquina Smith, línea completa de mancuernas, máquinas y equipo de cardio." },
      { q: "¿Ofrecen entrenamiento personal?", a: "Sí — Adrian y el equipo ofrecen sesiones uno a uno para todo nivel, desde principiantes hasta atletas competitivos." },
      { q: "¿Qué comodidades tienen?", a: "Toallas, lockers seguros, duchas con agua fría y caliente, agua purificada, guardería infantil y zona completa de pesas y cardio. El juice bar ofrece batidos y otras opciones refrescantes." },
      { q: "¿Dónde están ubicados exactamente?", a: "En la calle principal de West End, frente a la gasolinera Petrosun — a poca distancia a pie del centro de West End." },
    ],
  },
  contact: {
    kicker: "Contacto",
    title: "Vamos a",
    title2: "entrenar.",
    sub: "La forma más rápida de contactarnos es por WhatsApp. Pregunta por planes, entrenamiento personal o simplemente saluda — o encuéntranos en Instagram y Facebook.",
    btn: "Chatear por WhatsApp",
    call: "Llamar",
  },
  cta: {
    title: "Tu progreso",
    title2: "empieza hoy.",
    sub: "Encuentra tu ritmo. Siéntete en casa.",
    btn: "Empieza por WhatsApp",
  },
  footer: {
    tag: "La Casa del Progreso de Roatán.",
    rights: "Todos los derechos reservados.",
    follow: "Síguenos",
    contact: "Contacto",
    explore: "Explora",
  },
  wa: {
    general: "¡Hola Adrian's Gym! Me gustaría más información para entrenar con ustedes.",
    plan: (p: string) => `¡Hola Adrian's Gym! Me interesa el ${p}. ¿Me pueden dar más detalles?`,
    pt: "¡Hola Adrian! Me interesa el entrenamiento personal. ¿Podemos hablar de un plan?",
    group: "¡Hola Adrian's Gym! Somos cuatro personas interesadas en la membresía grupal y el descuento del 20%. ¿Nos comparten los detalles?",
    fuel: "¡Hola Adrian's Gym! ¿Me pueden compartir el menú del juice bar y los suplementos disponibles?",
    float: "Escríbenos",
  },
};

const dicts: Record<Lang, Dict> = { en, es };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: en });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    let saved: Lang | null = null;
    try { saved = localStorage.getItem("ag-lang") as Lang | null; } catch { /* Storage is optional. */ }
    if (saved === "en" || saved === "es") return saved;
    return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
  });
  useEffect(() => {
    try { localStorage.setItem("ag-lang", lang); } catch { /* Storage is optional. */ }
    document.documentElement.lang = lang;
  }, [lang]);
  return <LangContext.Provider value={{ lang, setLang, t: dicts[lang] }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
