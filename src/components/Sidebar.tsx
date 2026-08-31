import {
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  ArrowUpRight,
  Settings,
  Sparkles,
} from "lucide-react";

const navigation = [
  { label: "City", icon: Building2, active: true },
  { label: "Today", icon: CalendarDays },
  { label: "Projects", icon: BriefcaseBusiness },
  { label: "Sales", icon: ArrowUpRight },
  { label: "Odyseusz", icon: Sparkles },
];

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div>
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark__trunk" />
            <span className="brand-mark__crown" />
          </span>
          <span className="brand-name">
            BonsAI <strong>City</strong>
          </span>
        </div>
        <p className="brand-subtitle">Your business. Growing.</p>

        <div className="sidebar-rule" />

        <nav className="primary-nav">
          {navigation.map(({ label, icon: Icon, active }) => (
            active ? (
              <a className="nav-item nav-item--active" href="#city" key={label} aria-current="page">
                <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                <span>{label}</span>
              </a>
            ) : (
              <div className="nav-item nav-item--future" key={label} aria-disabled="true">
                <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                <span>{label}</span>
                <span className="nav-item__signal" aria-hidden="true" />
              </div>
            )
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-rule" />
        <div className="nav-item nav-item--future" aria-disabled="true">
          <Settings size={17} strokeWidth={1.6} aria-hidden="true" />
          <span>Settings</span>
          <span className="nav-item__signal" aria-hidden="true" />
        </div>
        <p className="sidebar-note">Private studio system / Step 01</p>
      </div>
    </aside>
  );
}
