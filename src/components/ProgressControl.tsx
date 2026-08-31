import { progressSteps } from "./projectVisualState";

type ProgressControlProps = {
  value: number;
  onChange: (value: number) => void;
};

export function ProgressControl({ value, onChange }: ProgressControlProps) {
  return (
    <section className="progress-control" aria-labelledby="progress-control-title">
      <div className="control-head">
        <span id="progress-control-title">Development control</span>
        <strong>{value}%</strong>
      </div>
      <div className="progress-rail" role="group" aria-label="Project progress">
        {progressSteps.map((step) => (
          <button
            className={`progress-step ${value === step ? "progress-step--active" : ""}`}
            key={step}
            type="button"
            onClick={() => onChange(step)}
            aria-pressed={value === step}
          >
            <span className="progress-step__dot" aria-hidden="true" />
            <span>{step}%</span>
          </button>
        ))}
      </div>
    </section>
  );
}
