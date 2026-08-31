import { ArrowUpRight, BriefcaseBusiness, Sprout, Target } from "lucide-react";

const snapshot = [
  { label: "Active Projects", value: "3", accent: "gold", icon: BriefcaseBusiness },
  { label: "Current Focus", value: "Sales", accent: "cyan", icon: ArrowUpRight },
  { label: "City Growth", value: "46%", accent: "moss", icon: Sprout },
  { label: "Next Milestone", value: "First Client", accent: "gold", icon: Target },
];

export function BusinessSnapshot() {
  return (
    <section className="info-panel snapshot-panel" aria-labelledby="snapshot-title">
      <div className="panel-heading">
        <div>
          <h2 id="snapshot-title">Business Snapshot</h2>
        </div>
      </div>
      <div className="snapshot-list">
        {snapshot.map(({ label, value, accent, icon: Icon }) => (
          <div className="snapshot-row" key={label}>
            <span className={`snapshot-row__icon snapshot-row__icon--${accent}`} aria-hidden="true"><Icon size={19} strokeWidth={1.45} /></span>
            <span className="snapshot-row__label">{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
