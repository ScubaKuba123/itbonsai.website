import { Focus, Leaf } from "lucide-react";

export function TopStatus() {
  return (
    <div className="top-status" aria-label="City status">
      <div className="top-status__left">
        <span className="status-pulse" aria-hidden="true" />
        <span className="top-status__label">City status</span>
        <span className="top-status__dash" aria-hidden="true">—</span>
        <span className="top-status__value">Growing</span>
      </div>
      <div className="top-status__right">
        <Leaf size={17} strokeWidth={1.4} aria-hidden="true" />
        <span className="top-status__divider" aria-hidden="true" />
        <Focus size={18} strokeWidth={1.4} aria-hidden="true" />
        <span className="top-status__time">10:24 PM</span>
      </div>
    </div>
  );
}
