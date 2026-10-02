export const HOURS = [[450, 720], [330, 1260], [330, 1260], [330, 1260], [330, 1260], [330, 1260], [390, 840]] as const;
const DAYS = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
};
const clock = new Intl.DateTimeFormat("en-US", { timeZone: "America/Tegucigalpa", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

export function getHoursState(now = new Date()) {
  const parts = Object.fromEntries(clock.formatToParts(now).map(part => [part.type, part.value]));
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const [start, end] = HOURS[day];
  return { day, open: minutes >= start && minutes < end, nextDay: minutes < start ? day : (day + 1) % 7, end };
}

export type HoursState = ReturnType<typeof getHoursState>;
export function formatHoursStatus(state: HoursState, lang: "en" | "es") {
  const time = (minutes: number) => {
    const hour = Math.floor(minutes / 60), minute = String(minutes % 60).padStart(2, "0");
    return lang === "es" ? `${hour}:${minute}` : `${hour % 12 || 12}:${minute} ${hour >= 12 ? "PM" : "AM"}`;
  };
  if (state.open) return lang === "es" ? `Abierto ahora · hasta las ${time(state.end)}` : `Open now · until ${time(state.end)}`;
  const day = state.nextDay === state.day ? (lang === "es" ? "hoy" : "today") : DAYS[lang][state.nextDay];
  const start = time(HOURS[state.nextDay][0]);
  return lang === "es" ? `Cerrado · abre ${day} a las ${start}` : `Closed · opens ${day} at ${start}`;
}
