import { Globe2, Send, Users } from "lucide-react";

const tasks = [
  { label: "Send client proposal", icon: Send },
  { label: "Find 5 new leads", icon: Users },
  { label: "Improve BonsAI website", icon: Globe2 },
];

export function TodayPreview() {
  return (
    <section className="info-panel today-panel" aria-labelledby="today-title">
      <div className="panel-heading">
        <div>
          <h2 id="today-title">Today</h2>
        </div>
      </div>
      <div className="today-list">
        {tasks.map(({ label, icon: Icon }) => (
          <div className="today-row" key={label}>
            <span className="today-row__indicator" aria-hidden="true" />
            <span className="today-row__icon" aria-hidden="true"><Icon size={19} strokeWidth={1.45} /></span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
