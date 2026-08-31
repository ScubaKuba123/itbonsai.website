import { Activity } from "lucide-react";

export function CityPulse() {
  return (
    <section className="city-pulse-card" aria-label="City Pulse">
      <span className="city-pulse-card__icon" aria-hidden="true">
        <Activity size={17} strokeWidth={1.55} />
      </span>
      <div>
        <span>City Pulse</span>
        <strong>1 operation active</strong>
      </div>
    </section>
  );
}
