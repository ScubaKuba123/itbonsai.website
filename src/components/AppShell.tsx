import { useMemo, useState } from "react";
import { CityPulse } from "./CityPulse";
import { CityVisual } from "./CityVisual";
import { ProjectInfoPanel } from "./ProjectInfoPanel";
import { Sidebar } from "./Sidebar";
import { TopStatus } from "./TopStatus";
import { montostalProject } from "./projectVisualState";
import { ProgressControl } from "./ProgressControl";

export function AppShell() {
  const [progress, setProgress] = useState(40);
  const project = useMemo(() => ({ ...montostalProject, progress }), [progress]);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <TopStatus />
        <main className="city-page" id="city">
          <div className="city-layout">
            <CityVisual project={project} />
            <div className="project-inspector">
              <CityPulse />
              <ProjectInfoPanel project={project} />
              <ProgressControl value={progress} onChange={setProgress} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
