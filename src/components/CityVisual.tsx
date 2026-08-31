import { Building2, Target } from "lucide-react";
import type { ProjectVisualState } from "./projectVisualState";

type CityVisualProps = {
  project: ProjectVisualState;
};

const stageLabel = (progress: number) => {
  if (progress === 0) return "Empty plot";
  if (progress < 20) return "Site preparation";
  if (progress < 40) return "Foundations";
  if (progress < 60) return "Structural frame";
  if (progress < 80) return "Building shell";
  if (progress < 100) return "Nearly complete";
  return "Permanent company asset";
};

export function CityVisual({ project }: CityVisualProps) {
  return (
    <section
      className={`city-visual city-visual--stage-${project.progress}`}
      aria-label="BonsAI City Montostal project visual prototype"
    >
      <div className="city-map">
        <img
          className="city-map__scene"
          src="/bonsai-city-foundation-world-v1.png"
          alt="A central bonsai tree growing from an atmospheric early futuristic company world"
        />
        <div className="city-map__shade" aria-hidden="true" />
        <div className="city-fog city-fog--near" aria-hidden="true" />
        <div className="city-fog city-fog--far" aria-hidden="true" />
        <div className="water-shimmer water-shimmer--one" aria-hidden="true" />
        <div className="water-shimmer water-shimmer--two" aria-hidden="true" />

        <div className="project-site" aria-label={`${project.shortName} ${project.name}, ${stageLabel(project.progress)}, ${project.progress}%`}>
          <div className="site-glow" aria-hidden="true" />
          <div className="site-ground" aria-hidden="true">
            <span className="survey-marker survey-marker--one" />
            <span className="survey-marker survey-marker--two" />
            <span className="survey-marker survey-marker--three" />
            <span className="site-sign">
              <Target size={13} strokeWidth={1.6} />
              MONTOSTAL
            </span>
          </div>

          <div className="site-materials" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="site-foundation" aria-hidden="true">
            <span className="foundation-grid" />
            <span className="anchor anchor--one" />
            <span className="anchor anchor--two" />
            <span className="anchor anchor--three" />
            <span className="anchor anchor--four" />
          </div>

          <div className="building-structure" aria-hidden="true">
            <span className="column column--one" />
            <span className="column column--two" />
            <span className="column column--three" />
            <span className="beam beam--one" />
            <span className="beam beam--two" />
            <span className="brace brace--one" />
            <span className="brace brace--two" />
          </div>

          <div className="building-shell" aria-hidden="true">
            <span className="facade facade--front" />
            <span className="facade facade--side" />
            <span className="roof-line" />
            <span className="window window--one" />
            <span className="window window--two" />
            <span className="window window--three" />
            <span className="window window--four" />
          </div>

          <div className="site-equipment" aria-hidden="true">
            <Building2 size={21} strokeWidth={1.55} />
            <span />
          </div>

          <div className="site-landscape" aria-hidden="true">
            <span className="young-tree young-tree--one" />
            <span className="young-tree young-tree--two" />
            <span className="path-light path-light--one" />
            <span className="path-light path-light--two" />
            <span className="path-light path-light--three" />
          </div>

          <div className="activity-lights" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="project-callout">
          <span className="project-callout__dot" aria-hidden="true" />
          <span className="project-callout__line" aria-hidden="true" />
          <span className="project-callout__card">
            <span>{project.shortName}</span>
            <strong>{stageLabel(project.progress)}</strong>
          </span>
        </div>
      </div>
    </section>
  );
}
