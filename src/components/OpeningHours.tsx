import { useEffect, useState } from "react";
import { useLang } from "../i18n";
import { formatHoursStatus, getHoursState, type HoursState } from "../openingHours";

function useOpeningHours() {
  const [state, setState] = useState<HoursState | null>(null);
  useEffect(() => {
    const update = () => setState(getHoursState());
    update();
    const timer = setInterval(update, 60000);
    document.addEventListener("visibilitychange", update);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, []);
  return state;
}

export function OpeningStatus() {
  const { lang } = useLang();
  const state = useOpeningHours();
  return <span data-hours-status="" className={"open-status " + (state?.open ? "status-open" : "")} role="status">
    <span className="status-dot" aria-hidden="true" />
    <span data-hours-label="">{state ? formatHoursStatus(state, lang) : (lang === "es" ? "Abierto los siete días" : "Open seven days a week")}</span>
  </span>;
}

export function OpeningHoursList() {
  const { t, lang } = useLang();
  const state = useOpeningHours();
  return <ul className="hours-list">{t.visit.hours.map((hour, index) => {
    const today = state !== null && (index === 0 ? state.day >= 1 && state.day <= 5 : state.day === (index === 1 ? 6 : 0));
    return <li key={hour.d} data-hours-row={index} className={today ? "hours-today" : ""}>
      <span>{hour.d}<small data-hours-today="" hidden={!today}>{lang === "es" ? "Hoy" : "Today"}</small></span><strong>{hour.h}</strong>
    </li>;
  })}</ul>;
}
