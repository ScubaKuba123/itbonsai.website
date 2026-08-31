import { Activity, ArrowUpRight, Building2, Sprout } from "lucide-react";
import type { ProjectVisualState } from "./projectVisualState";

type ProjectInfoPanelProps = {
  project: ProjectVisualState;
};

export function ProjectInfoPanel({ project }: ProjectInfoPanelProps) {
  return (
    <section className="project-panel" aria-labelledby="project-panel-title">
      <div className="project-panel__eyebrow">
        <Building2 size={16} strokeWidth={1.5} aria-hidden="true" />
        Selected building
      </div>
      <div className="project-panel__title">
        <span>{project.shortName}</span>
        <h2 id="project-panel-title">{project.name}</h2>
      </div>
      <dl className="project-facts">
        <div>
          <dt>Progress</dt>
          <dd>{project.progress}%</dd>
        </div>
        <div>
          <dt>Value</dt>
          <dd>{project.value}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{project.status}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>{project.type}</dd>
        </div>
      </dl>
      <div className="next-action">
        <span>
          <Activity size={16} strokeWidth={1.5} aria-hidden="true" />
          Next Action
        </span>
        <strong>{project.nextAction}</strong>
      </div>
      <button className="garden-link" type="button" disabled>
        <Sprout size={16} strokeWidth={1.5} aria-hidden="true" />
        Open in Garden
        <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <p className="garden-link-note">Future BonsAI Garden integration</p>
    </section>
  );
}
