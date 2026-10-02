import { useEffect, useRef } from "react";
import { map as createMap, tileLayer, marker, divIcon, control, type Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./GymMap.css";

// The gym listing's coordinates, verified against its matching address and phone.
export const GYM_COORDINATES: [number, number] = [16.3060784, -86.5898649];
export const GYM_DIRECTIONS = "https://www.google.com/maps/dir/?api=1&destination=16.3060784,-86.5898649&destination_place_id=ChIJkYvSbqXCaY8RDhH2UJ2kfKo";

export function GymMap({ directionsLabel }: { directionsLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let instance: Map | undefined;
    const resize = new ResizeObserver(() => instance?.invalidateSize({ pan: false }));
    resize.observe(element);
    const showMap = () => {
      if (instance) return;
      instance = createMap(element, { scrollWheelZoom: false, zoomControl: false, dragging: true }).setView(GYM_COORDINATES, 16);
      tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
      }).addTo(instance);
      control.zoom({ position: "bottomleft" }).addTo(instance);
      marker(GYM_COORDINATES, {
        title: "Adrian's Gym Roatán",
        alt: "Adrian's Gym location",
        icon: divIcon({
          className: "gym-map-pin",
          html: `<img src="${import.meta.env.BASE_URL}images/adrians-gym-mark.svg" alt="" width="48" height="48" />`,
          iconSize: [48, 48],
          iconAnchor: [24, 24],
          tooltipAnchor: [0, -28],
        }),
      }).addTo(instance).bindTooltip("Adrian's Gym", { permanent: true, direction: "top", className: "gym-map-label" });
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { showMap(); observer.disconnect(); }
    }, { rootMargin: "200px" });
    observer.observe(element);
    return () => { observer.disconnect(); resize.disconnect(); instance?.remove(); };
  }, []);
  return (
    <div className="gym-map">
      <div ref={ref} className="gym-map-canvas" aria-label="Map showing Adrian's Gym in West End, Roatán" />
      <a className="gym-map-directions" href={GYM_DIRECTIONS} target="_blank" rel="noopener noreferrer">
        {directionsLabel}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
      </a>
    </div>
  );
}
